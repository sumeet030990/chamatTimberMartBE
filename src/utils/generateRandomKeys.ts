const cryptoGenerator = require('crypto');

const key1 = cryptoGenerator.randomBytes(32).toString('hex');
const key2 = cryptoGenerator.randomBytes(32).toString('hex');

// eslint-disable-next-line no-console
console.table({ key1, key2 });
