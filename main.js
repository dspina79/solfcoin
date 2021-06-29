const {Transaction, Block, Blockchain} = require('./blockhain')

let solfcoin = new Blockchain();
const myAddress = 'addr_A';

solfcoin.addTransaction(new Transaction('address_b', myAddress, 18.00));
solfcoin.addTransaction(new Transaction(myAddress, 'address_c', 3.02));
solfcoin.addTransaction(new Transaction('address_b', myAddress, 9.11));
solfcoin.addTransaction(new Transaction('address_c', 'address_b', 12.10));

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
