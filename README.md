# pr-labels-check
Github Action to check if a PR's labels pass the specified rules

Example workflow file:
```yml
name: QA Labels Check
on:
  pull_request:
    types: [opened, edited, labeled, unlabeled, synchronize]
jobs:
  QA-check:
    if: github.base_ref == 'develop'
    runs-on: ubuntu-latest
    steps:
      - uses: danielchabr/pr-has-one-of-labels@master
        id: checkLabel
        with:
          hasSome: QA:tested,QA:skipped
```
