const mongoose = require("mongoose");


const opportunitySchema = new mongoose.Schema({
    title :  {
        type : String ,
        required : true , 
    },
    description :  {
        type : String ,
        required : false , 
    },
    date : {
        type : Date , 
        required: true 
    },
    createdAt : {
        type : Date , 
        required: false 
    },
    type : {
        type : String , 
        require : true 
    },
    duration : {
        type : String  , 
        required : false , 
    },
    sallary : {
        type : Number , 
        required : false 
    },
    contractType : {
        type : String , 
        required : false 
    },
    cover : {
        type : String , 
        required : false 
    },
    price : {
        type : Number, 
        require : false 
    },
    skills : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skill",
        required: false,
    } 
    ],
    company : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    applications : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "application",
            required: false,
        } 
        ]
})
module.exports = mongoose.model("opportunity", opportunitySchema);
