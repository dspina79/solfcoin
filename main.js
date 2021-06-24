const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.ts = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.previousHash = this.getLatestBlock().hash;
        block.hash = block.calculateHash();
        this.chain.push(block);
    }

    createGenesisBlock() {
        return new Block(0, '1/1/2021', 'Initialized Data', '0');
    }
}


let solfcoin = new Blockchain();
const block1 = new Block(1, '6/23/2021', {
                        sender: 'Pete',
                        recipient: 'Dave',
                        amount: 92.23   
                        });
const block2 = new Block(1, '6/23/2021', {
                        sender: 'Dave',
                        recipient: 'Willis',
                        amount: 23   
                        });

solfcoin.addBlock(block1);
solfcoin.addBlock(block2);

console.log(JSON.stringify(solfcoin, null, 4));