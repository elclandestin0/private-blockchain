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
    level.getBlockHeight().then(value => {
      if (value === 0) {
        this.addBlock(new Block("First block in the chain - Genesis block"));
      }
    });
  }

  getBlock(blockHeight) {
    return new Promise(function (resolve, reject) {
      level.getBlock(blockHeight)
        .then(function (value) {
          resolve(value);
        })
        .catch(function (error) {
          reject(error);
        })
    })
  }

  // Add new block
  addBlock(newBlock) {
    return new Promise(function (resolve, reject) {
      // Block height
      if (newBlock.body != "First block in the chain - Genesis block") {
        console.log("-------------------");
        console.log("Adding new block");
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        console.log("Hash: " + newBlock.hash);
        console.log("Data: " + newBlock.body);
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        console.log("Time: " + newBlock.time);
        level.getBlockHeight()
          .then(function (height) {
            newBlock.height = height;
            console.log("Height: " + newBlock.height);
          })
          .then(function () {
            level.getBlock(newBlock.height - 1)
              .then(function (value) {
                value = JSON.parse(value);
                newBlock.previousBlockHash = value.hash;
                console.log("New block's previous hash is: " + newBlock.previousBlockHash);
              })
              .then(function () {
                console.log("about to add the new block to the chain");
                level.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString())
                  .then(value => {
                    console.log("Block data: " + value);
                    resolve(value);
                    console.log("-------------------");
                  });
              })
              .catch(function (error) {
                console.log(error);
                reject(error);
              })
            // Adding block object to chain
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      } else {
        console.log("-------------------");
        console.log("Adding genesis block");
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        console.log("Hash: " + newBlock.hash);
        console.log("Height: " + newBlock.height);
        console.log("Data: " + newBlock.body);
        console.log("Time: " + newBlock.time);
        console.log("Previous block hash:" + newBlock.previousBlockHash);
        level.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString()).then(value => {
          resolve(value);
        });
        console.log("-------------------");
      }

    })
  }

  // validate block
  validateBlock(blockHeight) {
    return new Promise(function (resolve, reject) {
      // get block object
      const block = "";
      level.getBlock(blockHeight)
        .then(value => {
          block = value;
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
    })
  }

  // Validate blockchain
  validateChain() {
    let errorLog = [];
    getBlockHeight().then(function (value) {
      for (var i = 0; i < value - 1; i++) {
        // validate block
        validateBlock(i).then(function (booleanValue) {
          if (booleanValue === false) errorLog.push(i);
          // compare blocks hash link
          level.getBlock(i).then(function (block) {
            let parsedBlockOne = JSON.parse(block);
            let hash = parsedBlock.hash;
            level.getBlock(i + 1).then(function (block) {
              let parsedBlockTwo = JSON.parse(block);
              let previousHash = parsedBlockTwo.hash;
              if (hash !== previousHash) {
                errorLog.push(i);
              }
            })
          })
        })
      }
      if (errorLog.length > 0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: ' + errorLog);
      } else {
        console.log('No errors detected');
      }
    })

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