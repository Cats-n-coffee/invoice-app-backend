function generateId() {
    let str = require('crypto').randomBytes(3).toString('hex').toUpperCase();
    return str
}

module.exports = generateId;