const {Transaction, Block, Blockchain} = require('./blockhain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('bcb3f1be9da70a3e492b29bdb21d4c21fabbafa1db6f93b5addfdb462b6795fa');
const myAddress = myKey.getPublic('hex');


let solfcoin = new Blockchain();

const trx1 = new Transaction(myAddress, 'address_b', 15.02);
trx1.signTransaction(myKey);
solfcoin.addTransaction(trx1);

console.log('Minning Iteration 1');
solfcoin.minePendingTransactions(myAddress);

console.log('Balance of address_b: ' + solfcoin.getBalance('address_b'));
console.log('Balance of address_c: ' + solfcoin.getBalance('address_c'));
console.log('My balance: ' + solfcoin.getBalance(myAddress));

console.log('Mining Iteration 2');
solfcoin.minePendingTransactions(myAddress);

console.log('Balance of address_b: ' + solfcoin.getBalance('address_b'));
console.log('Balance of address_c: ' + solfcoin.getBalance('address_c'));
console.log('My balance: ' + solfcoin.getBalance(myAddress));
