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

  checkGenesisBlock(block) {
    return new Promise(function (resolve) {
      if (block.body === "First block in the chain - Genesis block") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  // Add new block
  addBlock(newBlock) {
    return new Promise(function (resolve, reject) {
      // Block height
      if (newBlock.body != "First block in the chain - Genesis block") {
        level.getDBLength()
          .then((height) => {
            console.log("old height: " + height);
            newBlock.height = height + 1;
            console.log("new height: " + newBlock.height);
            if (height > 0) {
              level.getLevelDBData(newBlock.height - 1)
                .then(value => {
                  console.log("previous block hash: " + newBlock.previousBlockHash);
                  newBlock.previousBlockHash = value.hash;
                })
                .catch(function (error) {
                  reject(error);
                })
            }
          })
          .then(function () {
            newBlock.time = new Date().getTime().toString().slice(0, -3);
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            console.log("newBlock hash is:" + newBlock.hash);
            console.log("newBlock time is: " + newBlock.time);
          })
          .then(function () {
            // Adding block object to chain
            level.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString()).then(value => {
              console.log(value);
              resolve(value);
            });
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      } else {
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
      }

    })
  }



  // validate block
  validateBlock(blockHeight) {
    return new Promise(function (resolve, reject) {
      // get block object
      const block = "";
      level.getLevelDBData(blockHeight)
        .then(value => {
          block = value;
          resolve(value);
        })
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
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
  }, 5000);
})(0);