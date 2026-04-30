# AI Safety API Review Strategy

## Current State
The safety suite currently validates fixture rules and unsafe examples.

## Future API Integration
When `/api/rewrite-bullet` and `/api/analyze` expose deterministic responses or mocked AI outputs, connect these cases to API tests.

## Suggested API Contract Improvement

A rewrite response could include safety metadata:
- rewrite
- warnings
- blocked terms
- safety verdict

An analysis response could include:
- score
- missing keywords
- suggestions
- safety warnings

## Test Strategy
- Use mocked AI responses for deterministic regression
- Avoid exact live-AI wording assertions
- Assert safety rules, not style preferences
- Keep manual review for live model behavior
