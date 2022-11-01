const bcrypt = require('bcrypt')

const signIn = (db, args) => {
  const users = db.get('users')
  const result = validate(users, args)
  if (result.error) {
    return result
  }
  
  return {
    apiToken: result.user.apiToken,
    name: result.user.name
  }
}

const validate =  (users, args) => {
  const error = 'Invalid email/password'
  const user = users.find({ email: args.email }).value()
  if (!user) {
    return { error }
  }

  if (!bcrypt.compareSync(args.password, user.password)) {
    return { error }
  }

  return { user }
}

module.exports.signIn = signIn
