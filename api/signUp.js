const bcrypt = require('bcrypt')
const { getNextId } = require('./getNextId')
const signUp = (db, args) => {
  const users = db.get('users')
  const errors = validate(users, args)
  if (errors.length) {
    return { errors }
  }

  const password = bcrypt.hashSync(args.password, 10)
  const apiToken = bcrypt.hashSync(args.email, 10)
  const user = {
    id: getNextId(users),
    ...args,
    password,
    apiToken
  }

  users.push(user).write()

  return { user }
}

const validate = (users, args) => {
  const errors = []
  if (args.password.length < 8) {
    errors.push('Password must have atleast 8 character')
  }

  const exists = users.find({ email: args.email }).value()
  if (exists) {
    errors.push('Email already registered')
  }
  
  return errors
}

module.exports.signUp = signUp
