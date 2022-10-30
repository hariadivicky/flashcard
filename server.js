const fs = require('fs')
const path = require('path')
const jsonServer = require('json-server')
const multer = require('multer')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { createDeck } = require('./api/createDeck')
const { updateDeck } = require('./api/updateDeck')
const dbPath = path.join(__dirname, 'data/db.json')

const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const adapter = new FileSync(dbPath)
const db = new low(adapter)
const upload = multer()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// overwrite create a deck, to allow file import.
server.post('/decks', upload.single('cards'), async (req, res) => {
  const result = await createDeck(db, req.body, req.file)
  return res.json(result)
})

// overwrite create a deck, to allow file import.
server.put('/decks/:id', upload.single('cards'), async (req, res) => {
  console.log({ params: req.params })
  const result = await updateDeck(db, parseInt(req.params.id), req.body, req.file)
  if (!result) {
    return res.sendStatus(404)
  }

  return res.json(result)
})

const router = jsonServer.router(dbPath)

// database reloader middleware,
// because json-server is not doing auto-reloading when used as a module.
server.use((_req, _res, next) => {
  const data = fs.readFileSync(dbPath)
  router.db.setState(JSON.parse(data))

  return next()
})

server.use(router)

const port = 5000
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`)
})
