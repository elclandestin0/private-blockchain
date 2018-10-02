/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('./levelSandbox.js');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.hash = "",
      this.height = 0,
      this.body = data,
      this.time = 0,
      this.previousBlockHash = ""
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  addBlock(newBlock) {
    // Block height
    level.getDBLength().then((height) => {
      newBlock.height = height + 1;
      if (height > 0) {
        level.getLevelDBData(newBlock.height).then(value => {
          newBlock.previousBlockHash = value.hash;
        })
      }
    });
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0, -3);
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
    level.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString()).then(value => {
      console.log(value);
    });
  }



  // get block
  getBlock(blockHeight) {
    // return object as a single string
    return new Promise(function (resolve, reject) {
      db.get(blockHeight, function (err, value) {
        if (err) return console.log("Can't find block!", err);
        resolve(value);
      })
    })
  }

  // validate block
  validateBlock(blockHeight) {
    // get block object
    let block = this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    return new Promise(function (resolve) {
      if (blockHash === validBlockHash) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
  }

  // Validate blockchain
  validateChain() {
    let errorLog = [];
    for (var i = 0; i < this.chain.length - 1; i++) {
      // validate block
      if (!this.validateBlock(i)) errorLog.push(i);
      // compare blocks hash link
      let blockHash = this.chain[i].hash;
      let previousHash = this.chain[i + 1].previousBlockHash;
      if (blockHash !== previousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: ' + errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}


let myBlockChain = new Blockchain();
(function theLoop(i) {
  setTimeout(function () {
    let blockTest = new Block("Test Block - " + (i + 1));
    myBlockChain.addBlock(blockTest).then((result) => {
      console.log(result);
      i++;
      if (i < 10) theLoop(i);
    });
  }, 10000);
})(0);