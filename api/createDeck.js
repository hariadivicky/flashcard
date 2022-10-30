const { getNextId } = require('./getNextId')
const { importCardsToDeck } = require('./importCardsToDeck')

const createDeck = async (db, args, file) => {
  const decks = db.get('decks')
  const deck = { id: getNextId(decks), ...args }
  decks.push(deck).write()

  if (file) {
    // we will ignore any import's errors.
    await importCardsToDeck(db, deck, file)
  }

  return deck
}

module.exports.createDeck = createDeck
