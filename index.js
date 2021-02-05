const core = require('@actions/core')
const github = require('@actions/github')

// check if this is running on a pull request
if (!github.context.payload.pull_request) {
  return core.setOutput('passed', true)
}

const token = core.getInput('githubToken');
const context = github.context
const octokit = github.getOctokit(token)

const hasSomeInput = core.getInput('hasSome')
const hasAllInput = core.getInput('hasAll')
const hasNoneInput = core.getInput('hasNone')
const hasNotAllInput = core.getInput('hasNotAll')

const hasSomeLabels = hasSomeInput.split(',')
const hasAllLabels = hasAllInput.split(',')
const hasNoneLabels = hasNoneInput.split(',')
const hasNotAllLabels = hasNotAllInput.split(',')

const failMessages = []


const prLabels = github.context.payload.pull_request.labels.map(item => item.name)

const hasSomeResult = !hasSomeInput || hasSomeLabels.some((label) =>
  prLabels.includes(label)
)

const hasAllResult = !hasAllInput || hasAllLabels.every((label) =>
  prLabels.includes(label)
)

const hasNoneResult = !hasNoneInput || hasNoneLabels.every((label) =>
  !prLabels.includes(label)
)

const hasNotAllResult = !hasNotAllInput || hasNotAllLabels.some((label) =>
  !prLabels.includes(label)
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

async function getHeadSha() {
  const pr = await octokit.pulls.get(
    {
      ...context.repo,
      pull_number: context.payload.pull_request.number || 0
    }
  )

  return pr.data.head.sha
}


async function run () {
  const params = {
      ...context.repo,
      head_sha: await getHeadSha(),
      name: `Action: ${context.action} Job: ${context.job} Workflow: ${context.workflow}`,
  }
  // console.log(params)
  console.log(await getHeadSha())

  console.log(github.sha)
  console.log(context)
  console.log(failMessages)
  if (failMessages.length) {
    console.log(failMessages)
    const check = await octokit.checks.create({
      ...params,
      status: 'completed',
      conclusion: 'failure',
      output: {
        title: 'failed',
        summary: failMessages.join('. ')
      }
    })

    core.info(JSON.stringify(check))

    core.info(failMessages.join('. '))
  } else {
    const check = await octokit.checks.create({
      ...params,
      status: 'completed',
      conclusion: 'success',
      output: {
        title: 'passed',
        summary: 'this passed'
      }
    })

    core.info(JSON.stringify(check))
    core.info('passed: true')
  }

  core.setOutput('passed', true)
}

run()
