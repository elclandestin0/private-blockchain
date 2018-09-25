/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key, value) {
  return new Promise(function (resolve, reject) {
    db.put(key, value)
      .on('error', function (err) {
        reject(err);
      }).on('close', function (value) {
        resolve(value);
      })
  })
}

// Get data from levelDB with key
function getLevelDBData(key) {
  return new Promise(function (resolve, reject) {
    db.get(key)
      .on('error', function (err) {
        reject(err);
      }).on('close', function (value) {
        resolve(value);
      })
  });
}

// Add data to levelDB with value
function addDataToLevelDB(key, value) {
  let i = 0;
  return new Promise(function (resolve, reject) {
    db.createReadStream()
      .on('data', function (data) {
        i++;
      }).on('error', function (err) {
        reject(err);
      }).on('close', function () {
        console.log('Block #' + i);
        addLevelDBData(key, value);
        resolve(value);
      });
  });
}

function getChainHeight() {
  let height = 0;
  return new Promise(function (resolve, reject) {
    db.createReadStream()
      .on('data', function () {
        height++;
      }).on('error', function (err) {
        reject(err);
      }).on('close', function () {
        resolve(height);
      })
  })
}

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/


(function theLoop(i) {
  setTimeout(function () {
    addDataToLevelDB('Testing data');
    if (--i) theLoop(i);
  }, 100);
})(10);