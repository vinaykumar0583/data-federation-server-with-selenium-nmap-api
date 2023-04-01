const express = require('express');
const { runNmapWorker } = require('./nmap-Worker');
const dbConnect = require("./mongodb");



const app1 = express();
const port = 4000;

app1.use(express.json());

app1.post('/api/nmap', (req, res) => {
  const { target } = req.body;
  runNmapWorker(target, (err, rest) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(rest);
      const insert = async () => {
        const db = await dbConnect();
        const result = await db.insertOne(rest);
        if (result.acknowledged) {
          console.log("data insert");
        }
      };
      insert();
    }
  })
});





app1.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});









module.exports = {
  app1,
 };