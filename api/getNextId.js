const getNextId = (collection) => {
  return collection.size().value() + 1
}

module.exports.getNextId = getNextId
