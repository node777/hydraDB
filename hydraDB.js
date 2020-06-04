const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");

const hydra=require("./hydra-chain.js");
const defaultGenisis=require("./default.genisis.block.js");
const multiGenisis=require("./multi-chain.genisis.block.js");

hydra.create("default", defaultGenisis);
hydra.create("multi", multiGenisis);

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//chain info
app.get('/chains/:chain?/:block?', (req, res) => {
  if(req.params.chain){
    var c = hydra.chains[req.params.chain]
    if(req.params.block){
      return res.send(c[req.params.block]);
    }else{
      return res.send(c);
    }
  }else{
    return res.send(hydra.chains);
  }
  
});
//query
app.get('/chains/:chain/query/:query/:args?', (req, res) => {
  var r = hydra.query(req.params.chain, req.params.query, req.params.args)||"Query could not be found"
  return res.send(r);
});
 //invoke
app.post('/chains/:chain/invoke/:invoke/:args?', (req, res) => {
  var r = hydra.invoke(req.params.chain, req.params.invoke, req.body);
  return res.send(r);
});
//todo scrub input
//create chain
app.put('/chains/:chain', (req, res) => {
  var d=JSON.parse(req.body);
  return res.send(`Could not create ${req.params.chain}`);
});
//removal of chains by costodian
app.delete('/chains/:chain', (req, res) => {
  return res.send(`Could not delete ${req.params.chain}`);
});

process.env.PORT=5001;
 
app.listen(process.env.PORT, () =>
  console.log(`Hydra serving on port ${process.env.PORT}!`),
);