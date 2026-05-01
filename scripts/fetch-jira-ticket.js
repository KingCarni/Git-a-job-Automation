const fs = require('fs');
const path = require('path');

const issueKey = process.argv[2];
const shouldForce = process.argv.includes('--force');

if (!issueKey) {
  console.error('Missing Jira issue key.');
  console.error('Usage: npm run fetch:jira -- JOB-103');
  console.error('Force overwrite: npm run fetch:jira -- JOB-103 -- --force');
  process.exit(1);
}

const requiredEnv = ['JIRA_BASE_URL', 'JIRA_EMAIL', 'JIRA_API_TOKEN'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error('');
  console.error('Set them in PowerShell first:');
  console.error('$env:JIRA_BASE_URL="https://your-domain.atlassian.net"');
  console.error('$env:JIRA_EMAIL="your-email@example.com"');
  console.error('$env:JIRA_API_TOKEN="your-jira-api-token"');
  process.exit(1);
}

const outputDir = 'jira-input';
const outputPath = path.join(outputDir, `${issueKey}.md`);

if (fs.existsSync(outputPath) && !shouldForce) {
  console.error(`Input file already exists: ${outputPath}`);
  console.error('Not overwriting.');
  console.error('');
  console.error('Use this only if you intentionally want to replace it:');
  console.error(`npm run fetch:jira -- ${issueKey} -- --force`);
  process.exit(1);
}

const baseUrl = process.env.JIRA_BASE_URL.replace(/\/+$/, '');
const authHeader = `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`;

function textFromAdfNode(node) {
  if (!node) return '';

  if (typeof node === 'string') return node;

  if (node.type === 'text') {
    let text = node.text || '';

    if (Array.isArray(node.marks)) {
      for (const mark of node.marks) {
        if (mark.type === 'strong') text = `**${text}**`;
        if (mark.type === 'em') text = `_${text}_`;
        if (mark.type === 'code') text = `\`${text}\``;
        if (mark.type === 'link' && mark.attrs && mark.attrs.href) {
          text = `[${text}](${mark.attrs.href})`;
        }
      }
    }

    return text;
  }

  const children = Array.isArray(node.content)
    ? node.content.map(textFromAdfNode).join('')
    : '';

  switch (node.type) {
    case 'doc':
      return Array.isArray(node.content)
        ? node.content.map(textFromAdfNode).filter(Boolean).join('\n\n')
        : '';

    case 'paragraph':
      return children.trim();

    case 'heading': {
      const level = node.attrs && node.attrs.level ? node.attrs.level : 2;
      return `${'#'.repeat(level)} ${children.trim()}`;
    }

    case 'bulletList':
      return Array.isArray(node.content)
        ? node.content.map(textFromAdfNode).filter(Boolean).join('\n')
        : '';

    case 'orderedList':
      return Array.isArray(node.content)
        ? node.content.map((item, index) => {
            const content = textFromAdfNode(item).replace(/^\s*-\s*/, '').trim();
            return `${index + 1}. ${content}`;
          }).join('\n')
        : '';

    case 'listItem':
      return `- ${children.trim()}`;

    case 'hardBreak':
      return '\n';

    case 'codeBlock':
      return `\n\`\`\`\n${children}\n\`\`\`\n`;

    case 'blockquote':
      return children
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');

    case 'rule':
      return '---';

    default:
      return children;
  }
}

function descriptionToMarkdown(description) {
  if (!description) return '';

  if (typeof description === 'string') return description;

  if (description.type === 'doc') {
    return textFromAdfNode(description).trim();
  }

  return JSON.stringify(description, null, 2);
}

async function jiraGetIssue(key) {
  const fields = [
    'summary',
    'description',
    'status',
    'issuetype',
    'labels',
  ].join(',');

  const url = `${baseUrl}/rest/api/3/issue/${encodeURIComponent(key)}?fields=${encodeURIComponent(fields)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      Accept: 'application/json',
    },
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
    throw new Error(`GET issue failed (${response.status}): ${message}`);
  }

  return parsed;
}

async function main() {
  console.log(`Fetching Jira issue ${issueKey}`);
  console.log(`Jira base URL: ${baseUrl}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Overwrite: ${shouldForce ? 'yes' : 'no'}`);
  console.log('');

  const issue = await jiraGetIssue(issueKey);
  const fields = issue.fields || {};

  const summary = fields.summary || '';
  const issueType = fields.issuetype && fields.issuetype.name ? fields.issuetype.name : '';
  const status = fields.status && fields.status.name ? fields.status.name : '';
  const labels = Array.isArray(fields.labels) ? fields.labels.join(', ') : '';
  const description = descriptionToMarkdown(fields.description);

  fs.mkdirSync(outputDir, { recursive: true });

  const content = `Key: ${issue.key || issueKey}
Summary: ${summary}
Issue Type: ${issueType}
Status: ${status}
Labels: ${labels}

Description:
${description || '(No description found)'}

Source:
Fetched from Jira by scripts/fetch-jira-ticket.js.
`;

  fs.writeFileSync(outputPath, content, 'utf8');

  console.log('Jira input file created.');
  console.log(outputPath);
  console.log('');
  console.log('Next commands:');
  console.log(`npm run generate:qa -- ${issueKey}`);
  console.log(`npm run import:testrail-csv -- ${issueKey}`);
}

main().catch((error) => {
  console.error('');
  console.error('Fetch failed.');
  console.error(error.message);
  process.exit(1);
});
