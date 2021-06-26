const SHA256 = require('crypto-js/sha256');
const fs = require('fs');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.ts = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.ts + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    persist() {
        fs.writeFile('solfchain.json', JSON.stringify(this), (err) => {
            if (err !== null) {
                console.log('Error writing: ' + JSON.stringify(err));
            }
        });
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalance(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (address === trans.fromAddress) {
                    balance -= trans.amount;
                }
                
                if (address === trans.toAddress) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined: " + block.hash);
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i -1];

            // check the hash is still valid
            if (current.hash !== current.calculateHash()) {
                return false;
            }

            if (current.previousHash !== previous.hash) {
                return false;
            }
        }

        return true;
    }

    createGenesisBlock() {
        const transaction = new Transaction(null, null, 0);
        const trans = [transaction];
        return new Block('1/1/2021', trans, '0');
    }
}


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
