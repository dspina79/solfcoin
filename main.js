const SHA256 = require('crypto-js/sha256');
const fs = require('fs');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.ts = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.ts + JSON.stringify(this.data) + this.nonce).toString();
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
        this.difficulty = 5;
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

    addBlock(block) {
        block.previousHash = this.getLatestBlock().hash;
        // add the block by mining it
        block.mineBlock(this.difficulty);
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
solfcoin.persist();