const { importCardsToDeck } = require('./importCardsToDeck')

const updateDeck = async (db, id, args, file) => {
  const deck = db.get('decks').find({ id })
  if (!deck.value()) {
    return false
  }

  deck.assign(args).write()

  if (file) {
    // we will ignore any import's errors.
    await importCardsToDeck(db, deck.value(), file)
  }

  return deck.value()
}

module.exports.updateDeck = updateDeck
