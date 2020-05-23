var fs = require('fs');
const express = require('express');
const app = express();

const bodyParser = require("body-parser");
var hydra={
  chains:{
    hydra:[
      {
        hash:"#genBlock",
        block:(timestamp, key, func, msg, sig)=>{
          var c=hydra.chains["hydra"];
          //todo:SCRUB INPUT
          let prevHash=c[c.length-1].h;
          let ts="timestamp";
          var b={
            p: prevHash,
            k: key,
            t: timestamp,
            f: func,
            m: msg,
            s: sig
          }
          blockHash="todo: hash";
          b.h=blockHash;
          return b;
        },
        chaincode:{
          //todo double check sig
          init:function(data){
              return "initiated"
          },
          create:function(data){
            console.log(data);
            return `created with ${String(data)}`
          }
        }
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
  let c=hydra.chains[req.params.chain];
  try{
    console.log(d);
    let r = c[0].chaincode[req.params.invoke](d);
    if(r){
      //todo scrub d
      var data =JSON.parse(d);
      let key = data.k;
      let ts = data.t;
      let msg = data.m;
      let inv = data.i;
      let sig = data.s;
      //block is valid
      try{
        let b= c[0].block(ts, key, inv, msg, sig);
        c.push(b);
        return res.send(`chaincode invoked: returned: ${r}`);
      }
      catch(e){
        return res.send(`chaincode could not be invoked: ERROR: ${e}`);
      }
    }
    else{
      return res.send(`ERROR: chain could not be found`);
    }
  }
  catch(err){
    return res.send(`could not execute the function ${req.params.invoke} on chain ${req.params.chain} with params ${d} - got error ${err}`);
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