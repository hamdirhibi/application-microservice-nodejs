const mongoose = require("mongoose");


const applicationSchema = new mongoose.Schema({
    
    motivation :  {
        type : String ,
        required : true , 
    },
    cv : {
        type : String , 
        require : true 
    },
    opportunity : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "opportunity",
        required: true,
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    status : {
        type : String , 
        require : true 
    },
    createdAt : {
        type : Date , 
        required : true 
    }

})
module.exports = mongoose.model("application", applicationSchema);
