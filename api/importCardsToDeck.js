const ExcelJS = require('exceljs')
const { Readable } = require('stream')
const { getNextId } = require('./getNextId')

CSV_FILE_TYPE = 'text/csv'
EXCEL_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
LEGACY_EXCEL_FILE_TYPE = 'application/vnd.ms-excel'

const importCardsToDeck = async (db, deck, file) => {
  if (!isFileTypeSupported(file.mimetype)) {
    return false
  }

  let cards = []
  switch(file.mimetype) {
    case CSV_FILE_TYPE:
      cards = await readFromCSV(file.buffer)
      break
    case LEGACY_EXCEL_FILE_TYPE:
    case EXCEL_FILE_TYPE:
      cards = await readFromExcel(file.buffer)
      break
    default:
      cards = await readFromCSV(file.buffer)
  }

  const cardCollection = db.get('cards')
  const cardSequence = getNextId(cardCollection)

  cards.forEach((card, index) => {
    card.id = cardSequence + index
    card.deckId = deck.id

    cardCollection.push(card).write()
  })
}

const readFromCSV = async (buffer) => {
  const workbook = new ExcelJS.Workbook()
  const stream = Readable.from(buffer)
  const worksheet = await workbook.csv.read(stream)

  const values = worksheet.getSheetValues()
  return values.map(mapCardObject)
}

const readFromExcel = async (buffer) => {
  const workbook = new ExcelJS.Workbook()
  const doc = await workbook.xlsx.load(buffer)

  const sheet = doc.worksheets[0]
  const values = sheet.getSheetValues()
  return values.map(mapCardObject)
}

const mapCardObject = (cell) => {
  return { front: cell[1], back: cell[2] }
}

const isFileTypeSupported = (fileType) => {
  return fileType === CSV_FILE_TYPE
          || fileType === EXCEL_FILE_TYPE
          || fileType === LEGACY_EXCEL_FILE_TYPE
}

module.exports.importCardsToDeck = importCardsToDeck
