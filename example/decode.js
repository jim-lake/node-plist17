const { decode } = require('../dist');

const buf = Buffer.from(process.argv[2], 'hex');
console.log(decode(buf));
