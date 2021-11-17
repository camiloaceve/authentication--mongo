const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function signup(req, res) {
  const password = await bcrypt.hash(req.body.password, 10)

  // validations unique registers
  const emails = await User.findOne({ email: req.body.email })
  if (emails) {
    return res.status(400).json({ error: 'Email exist!.' })
  }

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: password
  })
    .then(user => {
      return res.json({
        user: user,
        message: 'SignUp success!'
      })
    })
    .catch(err => {
      res.status(500).json(err)
    })

  /* User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists.' })
    }
    let newUser = new User(fields)
    newUser.save((err, successs) => {
      if (err) {
        console.log('Error in signup: ', err)
        return res.status(400), json({ error: 'Err signup' })
      }
      res.json({
        message: 'Signup success!'
      })
    })
  })*/
}

async function signin(req, res) {
  const { email, password } = req.body

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        res.status(404).json({ msg: 'User not found' })
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          // Create token
          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SIGNIN_KEY,
            {
              expiresIn: '30m'
            }
          )
          res.json({
            user: user,
            token: token
          })
        } else {
          // Unauthorized Access
          res.status(401).json({ msg: 'Password or email is invalid' })
        }
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
  /*User.findOne({ email }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "This user doesn't exist, signup first"
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        error: 'email or password incorrect'
      })
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SIGNIN_KEY, {
      expiresIn: '30m'
    })
    const { _id, name, email } = user

    res.json({
      token,
      user: { _id, name, email }
    })
  })*/
}

module.exports = {
  signup,
  signin
}
