/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

function addLevelDBData(key, value) {
  return new Promise(function (resolve, reject) {
    db.put(key, value)
      .then(function () {
        resolve(value);
      })
      .catch(function (error) {
        console.log("found an error while adding DB data!");
        reject(error);
      })
  });
}


function addLevelDBData(key, value) {
  return new Promise(function (resolve, reject) {
    db.put(key, value)
      .then(function () {
        resolve(value);
      })
      .catch(function (error) {
        console.log("found an error while adding DB data!");
        reject(error);
      })
  });
}

// Get data from levelDB with key
function getLevelDBData(key) {
  return new Promise(function (resolve, reject) {
    db.get(key)
      .then(function (value) {
        resolve(value);
      })
      .catch(function (error) {
        console.log("found an error while getting DB data!");
        reject(error);
      })
  })
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
  return new Promise(function (resolve, reject) {
    let i = 0;
    db.createReadStream()
      .on('data', function (data) {
        i++;
      }).on('error', function (err) {
        reject(err);
        return console.log('Unable to read data stream!', err)
      })
      .on('close', function () {
        console.log("Block #" + i);
        addLevelDBData(i, value);
      })
  })
}

function getDBLength() {
  return new Promise(function (resolve, reject) {
    let height = 0;
    db.createReadStream()
      .on('data', function (data) {
        height++;
      })
      .on('error', function (err) {
        reject(err);
        return console.log("Unable to get data height!", err);
      })
      .on('close', function () {
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


module.exports = {
  addLevelDBData: addLevelDBData,
  getLevelDBData: getLevelDBData,
  addDataToLevelDB: addDataToLevelDB,
  getDBLength: getDBLength
}