function generateId() {
    // let letters = (Math.random() * (26 - 1) + 1 )//.toString(16).substr(2, 2).toUpperCase();
    // let numbers = Math.floor(Math.random() * 90000) + 10000;
    // console.log('random', letters + numbers)
    // return letters + numbers

    let str = require('crypto').randomBytes(3).toString('hex').toUpperCase();
    return str
}

module.exports = generateId;