const core = require('@actions/core')
const github = require('@actions/github')

const labelsInput = core.getInput('labels')

const labels = labelsInput.split(',')

const hasLabel = github.context.payload.pull_request.labels.some((item) =>
  labels.includes(item.name)
)

if (!hasLabel) {
  core.setFailed(
    `The PR needs to have one of the following labels to pass this check: ${labels.join(
      ', '
    )}`
  )
}

core.setOutput('hasLabel', hasLabel)

console.log(
  `Does PR have one of '${labels.join(', ')}' labels?: ${hasLabel}`
)
