const { encode } = require('../dist');

const obj = JSON.parse(process.argv[2]);
console.log(encode(obj).toString('hex'));
