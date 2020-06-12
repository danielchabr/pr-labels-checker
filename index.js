const core = require('@actions/core')
const github = require('@actions/github')

const hasSomeInput = core.getInput('hasSome')
const hasAllInput = core.getInput('hasAll')
const hasNoneInput = core.getInput('hasNone')
const hasNotAllInput = core.getInput('hasNotAll')

const hasSomeLabels = hasSomeInput.split(',')
const hasAllLabels = hasAllInput.split(',')
const hasNoneLabels = hasNoneInput.split(',')
const hasNotAllLabels = hasNotAllInput.split(',')

const failMessages = []

console.log(hasSomeInput)
console.log(!hasSomeInput)
console.log(
  hasSomeLabels.some((item) =>
    github.context.payload.pull_request.labels.includes(item.name)
  )
)
const hasSomeResult = !hasSomeInput || hasSomeLabels.some((item) =>
  github.context.payload.pull_request.labels.includes(item.name)
)

const hasAllResult = !hasAllInput || hasAllLabels.every((item) =>
  github.context.payload.pull_request.labels.includes(item.name)
)

const hasNoneResult = !hasNoneInput || hasNoneLabels.every((item) =>
  !github.context.payload.pull_request.labels.includes(item.name)
)

const hasNotAllResult = !hasNotAllInput || hasNotAllLabels.some((item) =>
  !github.context.payload.pull_request.labels.includes(item.name)
)

if (!hasSomeResult) {
  failMessages.push(`The PR needs to have at least one of the following labels to pass this check: ${hasSomeLabels.join(
    ', '
  )}`)
}

if (!hasAllResult) {
  failMessages.push(`The PR needs to have all of the following labels to pass this check: ${hasAllLabels.join(
    ', '
  )}`)
}

if (!hasNoneResult) {
  failMessages.push(`The PR needs to have none of the following labels to pass this check: ${hasNoneLabels.join(
    ', '
  )}`)
}

if (!hasNotAllResult) {
  failMessages.push(`The PR needs to not have at least one of the following labels to pass this check: ${hasNotAllLabels.join(
    ', '
  )}`)
}

if (failMessages.length) {
  core.setFailed(failMessages.join('. '))
}

core.setOutput('passed', failMessages.length === 0)
