# PR Labels Checker
Github Action to check if a PR's labels pass the specified rules

## Input
- `hasSome`: Comma separated list of labels, PR needs at least of them
- `hasAll`: Comma separated list of labels, PR needs all of them
- `hasNone`: Comma separated list of labels, PR must not have any of them
- `hasNotAll`: Comma separated list of labels, PR must not have all of them
- `githubToken`: GitHub token
- `allowFailure`: When true, the action returns a successful exit code even if the label criteria are not met

## Output
- `passed`: boolean

## Permissions
If you have customized permissions for your GitHub token you will need to manually add these permissions for this action:
```
    permissions:
      pull-requests: read
      checks: write
```
More info on the syntax: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions

## Example workflow file
```yml
name: Labels Check
on:
  pull_request:
    types: [opened, labeled, unlabeled, synchronize]
jobs:
  QA-check:
    if: github.base_ref == 'master'
    runs-on: ubuntu-latest
    steps:
      - uses: danielchabr/pr-labels-checker@v3
        id: checkLabel
        with:
          hasSome: QA:tested,QA:skipped
          githubToken: ${{ secrets.GITHUB_TOKEN }}
  Do_not_merge-check:
    if: github.base_ref == 'master'
    runs-on: ubuntu-latest
    steps:
      - uses: danielchabr/pr-labels-checker@v3
        id: checkLabel
        with:
          hasNone: do not merge,blocked
          githubToken: ${{ secrets.GITHUB_TOKEN }}
```
