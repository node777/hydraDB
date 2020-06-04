// const ethers = require('ethers');
// const sha3 = require('sha3');
const crypto =require('crypto');
const hydra=require("./hydra-chain.js");


var defaultGenisis={
    hash:(m)=>{
    var h=crypto.createHash('sha256')
    h.update(m);
    return h.digest('hex');
  },
  block:(prevHash, timestamp, key, func, msg, sig)=>{
    //set up block variables
    //todo:SCRUB INPUT
    //verify hashes verify
    //var c=hydra.query("hydra");
    //let prevHash=c[c.length-1].h;
    //create block
    var b={
      //todo compare hashes
      p: prevHash,
      k: key,
      t: timestamp,
      f: func,
      m: msg
    }
    //todo verify signature
    b.s=sig;
    //hash
    b.h=defaultGenisis.hash(JSON.stringify(b));
    //return block
    return b;
  },
  chaincode:{
    init:function(data){
        return "initiated"
    },
    write:function(data){
      //console.log(data);
      let d=JSON.parse(data);
      //console.log(d.k);
      hydra.db[d.k]=d.m;
      //console.log(hydra.db);
      return `added value ${String(data)} to location ${d.k}`
    },
    read:(data)=>{
      var r = hydra.db[data.toLowerCase()];
      //console.log(data.toString(), hydra.db, r);
      return `read data ${r}`
      
    }
  }
}
function flatten(obj){
  //todo fix this flatten fn
  var r=``;
  for(subObj in obj){
    var s =obj[subObj];
    //if subobj is func
    if(!!(s && s.constructor && s.call && s.apply)){
      r+=s.toString()
      //console.log(s.toString());
    }
    else if(typeof s === 'string' || s instanceof String){
      r+=s;
    }
    else{
      r+=JSON.stringify(flatten(s));
      //console.log(JSON.stringify(s));
    }
  }
  //console.log(r);
  return r;
}

let g=flatten(defaultGenisis);
defaultGenisis.h=defaultGenisis.hash(g);
module.exports=defaultGenisis;