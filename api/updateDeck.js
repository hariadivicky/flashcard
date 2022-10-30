const { importCardsToDeck } = require('./importCardsToDeck')

const updateDeck = async (db, id, file) => {
  const deck = db.get('decks').find({ id })
  if (!deck.value()) {
    return false
  }

  if (file) {
    // we will ignore any import's errors.
    await importCardsToDeck(db, deck.value(), file)
  }

  return deck.value()
}

module.exports.updateDeck = updateDeck
