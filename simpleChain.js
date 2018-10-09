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
|  Class with a constructor for new blockchain  		|
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

  getBlockHeight() {
    return new Promise(function (resolve, reject) {
      level.getBlockHeight()
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
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                console.log("Hash: " + newBlock.hash);
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
        console.log("Height: " + newBlock.height);
        console.log("Data: " + newBlock.body);
        console.log("Time: " + newBlock.time);
        console.log("Previous block hash:" + newBlock.previousBlockHash);
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        console.log("Hash: " + newBlock.hash);
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
      level.getBlock(blockHeight)
        .then(value => {
          let block = JSON.parse(value);
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
        .catch(function (error) {
          reject(error);
        })
    })
  }

  // Validate blockchain
  validateChain() {
    let errorLog = [];
    let validateBlockPromises = [];
    level.getBlockHeight()
      .then(value => {
        for (var i = 0; i < value; i++) {
          // validate block
          this.validateBlock(i)
            .then(function (booleanValue) {
              if (booleanValue === false) errorLog.push(i);
            })
          // compare blocks hash link
          level.getBlock(i)
            .then(function (block) {
              let parsedBlockOne = JSON.parse(block);
              let hash = parsedBlockOne.hash;
              let nextBlockHeight = parsedBlockOne.height + 1;
              if (nextBlockHeight == value) {
                console.log("reached it's limit!");
                return;
              }
              console.log("hash of block : " + hash);
              level.getBlock(nextBlockHeight)
                .then(function (block) {
                  let parsedBlockTwo = JSON.parse(block);
                  let previousBlockHash = parsedBlockTwo.previousBlockHash;
                  console.log("previous hash of block : " + previousBlockHash);
                  if (hash !== previousBlockHash) {
                    errorLog.push(i);
                  }
                })
            })

          //   .then(function () {
          //     let j = i + 1;
          //     if (j === value) {
          //       console.log("reached the limit! ");
          //       return;
          //     };
          //     level.getBlock(j)
          //       .then(function (block) {
          //         let parsedBlockTwo = JSON.parse(block);
          //         let previousHash = parsedBlockTwo.previousHash;
          //         if (hash !== previousHash) {
          //           errorLog.push(i);
          //         }
          //       })
          //   })
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
// myBlockChain.validateBlock(0).then(x => console.log(x));
myBlockChain.validateChain();
// (function theLoop(i) {
//   setTimeout(function () {
//     let blockTest = new Block("Test Block - " + (i + 1));
//     myBlockChain.addBlock(blockTest).then((result) => {
//       console.log(result);
//       i++;
//       if (i < 5) theLoop(i);
//     });
//   }, 2000);
// })(0);

/** commands for node: 
 * 
 * blockchain = new Blockchain();
 * blockchain.addBlock(new Block("memo 1"));
 * blockchain.validateBlock(3).then(x => console.log(x));
 * blockchain.validateChain();
 */