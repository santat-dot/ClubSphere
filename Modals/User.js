let mongoose = require("mongoose");
let Schema=mongoose.Schema;
const passportLocalMongoose =require("passport-local-mongoose")

let userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});

// support both ESM default export and CommonJS export
userSchema.plugin(
    passportLocalMongoose && passportLocalMongoose.default
        ? passportLocalMongoose.default
        : passportLocalMongoose
);
module.exports = mongoose.model('User', userSchema);
