require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  console.log(req.headers)

  // Comprobar que existe el token
  if (!req.headers.authorization) {
    res.status(401).json({ msg: 'Acceso no autorizado' })
  } else {
    // Comrpobar la validez de este token
    const token = req.headers.authorization.split(' ')[1]

    // Comprobar la validez de este token
    jwt.verify(token, process.env.JWT_SIGNIN_KEY, (err, decoded) => {
      if (err) {
        res
          .status(500)
          .json({ msg: 'Ha ocurrido un problema al decodificar el token', err })
      } else {
        req.user = decoded
        next()
      }
    })
  }
}
