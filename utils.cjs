function parseInputTags (inputText) {
  const removeNewLine = inputText.split('\n').join(',')
  const splitByComma = removeNewLine.split(',');

  const trimmed =  splitByComma.map(tag => tag.trim())

  const notEmpty = trimmed.filter(tag => tag !== "")

  return notEmpty
}

exports.parseInputTags = parseInputTags