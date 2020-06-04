// const ethers = require('ethers');
// const sha3 = require('sha3');
// const crypto = require('crypto');
var hydra={
  db:{},
  chains:{
  },
  create:(chain, genisisBlock)=>{
    //todo check name collisions
    hydra.chains[chain]=[
      genisisBlock
    ]
    //console.log("created genisis "+JSON.stringify(this)+" for "+chain)
  },
  query:(chain, query,args)=>{
    if(query){
      let c=hydra.chains[chain];
      var r = c[0].chaincode[query](args);
      return `query ${query} been invoked on chain ${chain}. Recieved response: ${r}`;
    }
    else{
      return hydra.chains[chain];
    }
  },
  invoke:(chain, invoke, body)=>{

    try{
      var d=Object.keys(body)[0];
      var data =JSON.parse(d);
      let c=hydra.chains[chain];
      //console.log(c[0].chaincode[invoke],d);
      let r = c[0].chaincode[invoke](d);
      if(r){
        //todo scrub d

        let prevHash = data.p;
        let key = data.k;
        let ts = data.t;
        let msg = data.m;
        let inv = data.i;
        let sig = data.s;

        let b= c[0].block(prevHash, ts, key, inv, msg, sig);
        var t= c;
        //multichain
        if(c[0].chainRef){
          console.log(c[0]);
          if(hydra.chains[c[0].chainRef(data)]===undefined){
            console.log(c[0].subGenisis(chain, c[0].h))
            hydra.chains[c[0].chainRef(data)]=[ c[0].subGenisis(chain, c[0].h)||{} ]
          }
          t=hydra.chains[c[0].chainRef(data)];
        }
        //ret
        return hydra.addBlock(t, b, r); 
      }
      else{
        return `ERROR: chain could not be found`;
      }
    }
    catch(err){
      return `could not execute the function ${invoke} on chain ${chain} with params ${body} - got error ${err}`;
    }
  },
  addBlock:(c, b, r)=>{
    //todo verify timestamp
    //block is valid
    try{
      if(b.p==c[c.length-1].h){
        console.log(c, b)
        c.push(b);
        return `chaincode invoked: returned: ${r}`;
      }else{
        //throw "Previous hash does not match: server may be under intense load";
      }
    }
    catch(e){
      return `chaincode could not be invoked: ERROR: ${e}`;
    }

  }
}
module.exports=hydra;