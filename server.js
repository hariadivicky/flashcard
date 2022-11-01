const fs = require('fs')
const path = require('path')
const jsonServer = require('json-server')
const multer = require('multer')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { createDeck } = require('./api/createDeck')
const { updateDeck } = require('./api/updateDeck')
const { signUp } = require('./api/signUp')
const { signIn } = require('./api/signIn')
const dbPath = path.join(__dirname, 'data/db.json')

const adapter = new FileSync(dbPath)
const db = new low(adapter)
// database default collections.
db.defaults({ decks: [], cards: [], users: [] }).write()

const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const upload = multer()
const router = jsonServer.router(dbPath)

server.use(middlewares)
server.use(jsonServer.bodyParser)
// database reloader middleware,
// because json-server is not doing auto-reloading when used as a module.
server.use((_req, _res, next) => {
  const data = fs.readFileSync(dbPath)
  router.db.setState(JSON.parse(data))

  next()
})

server.post('/auth/sign_up', (req, res) => {
  db.read()
  const result = signUp(db, req.body)
  if (result.errors) {
    return res.status(400).json(result)
  }

  res.json(result)
})

server.post('/auth/sign_in', (req, res) => {
  db.read()
  const result = signIn(db, req.body)
  if (result.error) {
    return res.status(400).json(result)
  }

  res.json(result)
})

server.use((req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.sendStatus(401)
  }

  const apiToken = authHeader.split(' ')[1]
  if (!apiToken) {
    return res.sendStatus(401)
  }

  const isValidToken = db.get('users').find({ apiToken }).value()
  if (!isValidToken) {
    return res.sendStatus(401)
  }

  next()
})

// overwrite create a deck, to allow file import.
server.post('/decks', upload.single('cards'), async (req, res) => {
  db.read()
  const result = await createDeck(db, req.body, req.file)
  return res.json(result)
})

// overwrite create a deck, to allow file import.
server.put('/decks/:id/cards/import', upload.single('cards'), async (req, res) => {
  db.read()
  const result = await updateDeck(db, parseInt(req.params.id), req.file)
  if (!result) {
    return res.sendStatus(404)
  }

  return res.json(result)
})

server.delete('/data', (_req, res) => {
  db.read()

  db.set('decks', []).write()
  db.set('cards', []).write()
  db.set('users', []).write()

  res.json({ success: true })
})

server.use(router)

const port = 5000
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`)
})
