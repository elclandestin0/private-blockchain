Hello and welcome to my private blockchain API! 

To begin, clone the project and navigate to `private-blockchain` via your favourite terminal 
application, and hit `npm install` to download all the dependencies in `package.json`.

Next, hit the command `node .\simpleChain.js` (on Windows) or `node ./simpleChain.js` (on Mac) to
begin listening on port `8000` and then fire up CURL or Postman. There are two API endpoints here:
<ul>
  <li> GET Block Endpoint: 
    <code> localhost:8000/block/:blockNumber </code> is the GET endpoint to return the corresponding block number</li>
   <li> POST Block Endpoint: 
  <code> localhost:8000/block/:blockContent </code> is the POST endpoint to add a block with the `blockContent` acting as the data to be added within the block. If the `blockContent` string is empty, then no block is added.</li>
</ul>

Let me know if you have any questions!
