const fs = require('fs');
const path = require('path');

const issueKey = process.argv[2];
const shouldApply = process.argv.includes('--apply');

const PROJECT_NAME = process.env.TESTRAIL_PROJECT || 'Git-a-Job Automation';

if (!issueKey) {
  console.error('Missing Jira issue key.');
  console.error('Usage dry-run: npm run import:testrail-csv -- JOB-126');
  console.error('Usage apply:   npm run import:testrail-csv -- JOB-126 --apply');
  process.exit(1);
}

const requiredEnv = ['TESTRAIL_URL', 'TESTRAIL_USER', 'TESTRAIL_API_KEY'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const csvPath = path.join('generated-qa', issueKey, `${issueKey}-testrail-cases.csv`);

if (!fs.existsSync(csvPath)) {
  console.error(`CSV file not found: ${csvPath}`);
  console.error(`Run: npm run generate:qa -- ${issueKey}`);
  process.exit(1);
}

const baseUrl = process.env.TESTRAIL_URL.replace(/\/+$/, '');
const authHeader = `Basic ${Buffer.from(`${process.env.TESTRAIL_USER}:${process.env.TESTRAIL_API_KEY}`).toString('base64')}`;

function normalizeApiResponse(data, key) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  return [];
}

async function testrail(method, endpoint, body) {
  const url = `${baseUrl}/index.php?/api/v2/${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let parsed;

  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    const message = typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
    throw new Error(`${method} ${endpoint} failed (${response.status}): ${message}`);
  }

  return parsed;
}

function parseCsv(content) {
  const rows = [];
  let current = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (inQuotes && char === '"' && next === '"') {
      field += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && char === ',') {
      current.push(field);
      field = '';
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') i += 1;
      current.push(field);
      field = '';

      if (current.some((value) => value.trim() !== '')) {
        rows.push(current);
      }

      current = [];
      continue;
    }

    field += char;
  }

  if (field.length > 0 || current.length > 0) {
    current.push(field);
    if (current.some((value) => value.trim() !== '')) {
      rows.push(current);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim());

  return rows.slice(1).map((values) => {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });
    return row;
  });
}

function toPriorityId(priority) {
  const value = String(priority || '').toLowerCase();
  if (value.includes('critical')) return 4;
  if (value.includes('high')) return 3;
  if (value.includes('medium')) return 2;
  if (value.includes('low')) return 1;
  return 2;
}

function toTypeId(type) {
  const value = String(type || '').toLowerCase();
  if (value.includes('automated')) return 1;
  if (value.includes('functional') || value.includes('functionality')) return 2;
  if (value.includes('regression')) return 4;
  if (value.includes('performance')) return 8;
  return 6;
}

function buildCasePayload(row) {
  const steps = row.Steps || '';
  const expected = row['Expected Result'] || '';
  const notes = row.Notes || '';
  const automationId = row['Automation ID'] || '';
  const automationType = row['Automation Type'] || '';
  const playwrightFile = row['Playwright File'] || '';
  const playwrightCommand = row['Playwright Command'] || '';

  const combinedSteps = [
    steps && `Steps:\n${steps}`,
    expected && `\nExpected Result:\n${expected}`,
    automationId && `\nAutomation ID:\n${automationId}`,
    automationType && `Automation Type:\n${automationType}`,
    playwrightFile && `Playwright File:\n${playwrightFile}`,
    playwrightCommand && `Playwright Command:\n${playwrightCommand}`,
    notes && `\nNotes:\n${notes}`,
  ].filter(Boolean).join('\n');

  return {
    title: row.Title,
    refs: row.References || undefined,
    estimate: row.Estimate || undefined,
    priority_id: toPriorityId(row.Priority),
    type_id: toTypeId(row.Type),
    custom_preconds: row.Preconditions || undefined,
    custom_steps: combinedSteps || undefined,
    custom_expected: expected || undefined,
    custom_case_automation_id: automationId || title,
  };
}

async function getProjectByName(projectName) {
  const data = await testrail('GET', 'get_projects&is_completed=0');
  const projects = normalizeApiResponse(data, 'projects');
  const project = projects.find((item) => item.name === projectName);

  if (!project) {
    const names = projects.map((item) => item.name).join(', ');
    throw new Error(`Project not found: ${projectName}. Available projects: ${names}`);
  }

  return project;
}

async function getSections(projectId) {
  const data = await testrail('GET', `get_sections/${projectId}`);
  return normalizeApiResponse(data, 'sections');
}

async function getOrCreateSection(projectId, sectionName) {
  const sections = await getSections(projectId);
  const existing = sections.find((section) => section.name === sectionName);

  if (existing) return existing;

  if (!shouldApply) {
    return { id: `DRY-RUN-SECTION-${sectionName}`, name: sectionName, dryRun: true };
  }

  return testrail('POST', `add_section/${projectId}`, {
    name: sectionName,
    description: `Created by generated QA package importer for ${issueKey}.`,
  });
}

async function getCases(projectId) {
  const all = [];
  let offset = 0;
  const limit = 250;

  while (true) {
    const data = await testrail('GET', `get_cases/${projectId}&limit=${limit}&offset=${offset}`);
    const cases = normalizeApiResponse(data, 'cases');
    all.push(...cases);

    const next = data && data._links && data._links.next;
    if (!next || cases.length === 0) break;

    offset += limit;
  }

  return all;
}

async function addCaseWithFallback(sectionId, payload) {
  try {
    return await testrail('POST', `add_case/${sectionId}`, payload);
  } catch (error) {
    const fallback = {
  title: payload.title,
  refs: payload.refs,
  estimate: payload.estimate,
  priority_id: payload.priority_id,
  type_id: payload.type_id,
  custom_case_automation_id: payload.custom_case_automation_id,
  custom_steps: [
    payload.custom_preconds && `Preconditions:\n${payload.custom_preconds}`,
    payload.custom_steps,
    payload.custom_expected && `\nExpected:\n${payload.custom_expected}`,
    payload.custom_case_automation_id && `\nAutomation ID:\n${payload.custom_case_automation_id}`,
  ].filter(Boolean).join('\n'),
};

    console.warn(`Full payload failed for "${payload.title}". Retrying with simpler payload.`);
    console.warn(error.message);

    return testrail('POST', `add_case/${sectionId}`, fallback);
  }
}

async function main() {
  console.log(`Importing generated TestRail CSV for ${issueKey}`);
  console.log(`CSV: ${csvPath}`);
  console.log(`Project: ${PROJECT_NAME}`);
  console.log(`Mode: ${shouldApply ? 'APPLY' : 'DRY RUN'}`);
  console.log('');

  const csvRows = parseCsv(fs.readFileSync(csvPath, 'utf8'));

  if (csvRows.length === 0) {
    throw new Error('No CSV rows found.');
  }

  const project = await getProjectByName(PROJECT_NAME);
  const existingCases = await getCases(project.id);
  const existingByTitle = new Set(existingCases.map((testCase) => testCase.title));

  let created = 0;
  let skipped = 0;
  let planned = 0;
  const sectionCache = new Map();

  for (const row of csvRows) {
    const title = row.Title;
    const sectionName = row.Section || 'Manual - Generated QA';

    if (!title) {
      console.warn('Skipping row without title.');
      skipped += 1;
      continue;
    }

    if (existingByTitle.has(title)) {
      console.log(`SKIP duplicate: ${title}`);
      skipped += 1;
      continue;
    }

    if (!sectionCache.has(sectionName)) {
      const section = await getOrCreateSection(project.id, sectionName);
      sectionCache.set(sectionName, section);
    }

    const section = sectionCache.get(sectionName);
    const payload = buildCasePayload(row);

    if (!shouldApply) {
      console.log(`WOULD CREATE [${sectionName}]: ${title}`);
      planned += 1;
      continue;
    }

    const createdCase = await addCaseWithFallback(section.id, payload);
    console.log(`CREATED C${createdCase.id}: ${title}`);
    existingByTitle.add(title);
    created += 1;
  }

  console.log('');
  console.log('Summary');
  console.log('-------');
  console.log(`Rows read: ${csvRows.length}`);
  console.log(`Created: ${created}`);
  console.log(`Skipped duplicates/invalid: ${skipped}`);
  console.log(`Planned in dry-run: ${planned}`);

  if (!shouldApply) {
    console.log('');
    console.log('Dry run only. To import for real, run:');
    console.log(`npm run import:testrail-csv -- ${issueKey} --apply`);
  }
}

main().catch((error) => {
  console.error('');
  console.error('Import failed.');
  console.error(error.message);
  process.exit(1);
});
