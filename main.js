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
        return SHA256(this.index + this.previousHash + this.ts + JSON.stringify(this.data)).toString();
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
console.log(solfcoin.isChainValid());

// tampering
solfcoin.chain[1].ts = '1/2/1989';
console.log(solfcoin.isChainValid());
