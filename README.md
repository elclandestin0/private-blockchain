Hello and welcome to my private blockchain API! 
It is done with Node.js powered by the <a href="https://expressjs.com"> ExpressJS framework.</a>

To begin, clone the project and navigate to `private-blockchain` via your favourite terminal 
application, and hit `npm install` to download all the dependencies in `package.json`.

Next, hit the command `node .\simpleChain.js` (on Windows) or `node ./simpleChain.js` (on Mac) to
begin listening on port `8000` and then fire up CURL or Postman. There are two API endpoints here:
<ul>
  <li> GET Block Endpoint: 
    <code> localhost:8000/block/:blockNumber </code> is the GET endpoint to return the corresponding block number</li>
    <b>Example:</b> <code> localhost:8000/block/1 </code> returns:
    <code>

    {
    "hash": "53ec3a61a89175a60f0a4fe603a29077b826c88f4ad144caf395633e8f986fcd",
    "height": 1,
    "body": "Test Block - 1",
    "time": "1539697254",
    "previousBlockHash": "028a38089b871f8742f635bf93f926eff59e20a6f897cb38a81f96d60f985e00"
     }
</code>
   <li> POST Block Endpoint: 
  <code> localhost:8000/block/:blockContent </code> is the POST endpoint to add a block with the `blockContent` acting as the data to be added within the block. If the `blockContent` string is empty, then no block is added.</li>
     <b>Example:</b> <code> localhost:8000/block/test string </code> returns:
    <code>

    {
    "hash": "32986314b26b589e164f6c057c822ae43b3369d0e10186078c94af216daffa7e",
    "height": 19,
    "body": "test string",
    "time": "1539725135",
    "previousBlockHash": "706ed4ee28d41418187d256c506c1d8c0815ac72007c5f409921138c95e2706e"
    }
</code>
   <li> POST Block Endpoint (payload): 
  <code> localhost:8000/block/ </code> is the POST endpoint to add a block with the `body` acting as the data to be added within the block. If the `body` variable is empty, then no block is added.</li>
     <b>Example:</b> <code> localhost:8000/block/ </code> returns:
    <code>

    {
    "hash": "32986314b26b589e164f6c057c822ae43b3369d0e10186078c94af216daffa7e",
    "height": 19,
    "body": "test string",
    "time": "1539725135",
    "previousBlockHash": "706ed4ee28d41418187d256c506c1d8c0815ac72007c5f409921138c95e2706e"
    }
</code>
</ul>



Let me know if you have any questions!
