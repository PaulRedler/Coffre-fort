const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword: (password) => bcrypt.hash(password, 10),
  comparePassword: (password, hash) => bcrypt.compare(password, hash),
  generateToken: (user) => jwt.sign({ id: user.id, roles: user.roles }, "secret123", { expiresIn: "2h" })
}
