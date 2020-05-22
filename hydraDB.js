var fs = require('fs');
const express = require('express');
const app = express();

const bodyParser = require("body-parser");
var hydra={
  chains:{
    hydra:[
    
      {
        hash:"#genBlock",
        chaincode:{
          init:function(data){
              return "initiated"
          },
          create:function(data){
            console.log(data);
            return `created with ${String(data)}`
        },
      }
      },
      {
        hash:"#block1"
      }
    
    ]
  }
}
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/chains/:chain', (req, res) => {
  return res.send(hydra.chains[req.params.chain]);
});

app.get('/chains/:chain/query/:query', (req, res) => {
  var r = `query ${req.params.query} been invoked on chain ${req.params.chain}`
  return res.send(r);
});
 
app.post('/chains/:chain/invoke/:invoke', (req, res) => {
  var d=Object.keys(req.body)[0];
  try{
    console.log(d);
    let r = hydra.chains[req.params.chain][0].chaincode[req.params.invoke](d);
    return res.send(r);
  }
  catch{
    return res.send(`could not execute the function ${req.params.invoke} on chain ${req.params.chain} with params ${d}`);
  }
});
 //allow creating of new chains
 /*
app.put('/chains/:chain', (req, res) => {
  return res.send('Received a PUT HTTP method');
});
 
app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});
*/
process.env.PORT=5000;
 
app.listen(process.env.PORT, () =>
  console.log(`Hydra serving on port ${process.env.PORT}!`),
);