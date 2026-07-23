let mongoose = require("mongoose");
let list=require("../Modals/listing.js")
let initData=require("./data.js");


let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

async function main() {
  await mongoose.connect(MONGO_URL);
} 

main().then((res) =>{
    console.log("Database Connected Successfully");
}).catch((err)=>{
    console.log(err);
})

let data = async function(){
    await list.deleteMany({});
    list.insertMany(initData.data).then((res)=>{
        console.log("data is inserted Successfully");
    }).catch((err)=>{
        console.log(err);
    });
}

data();
