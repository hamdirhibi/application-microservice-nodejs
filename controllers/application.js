const Notification = require ('../models/notification');
const Opportunity = require('../models/opportunity');
const User = require('../models/user') ; 
const Application = require('../models/application') ; 
var ObjectID = require('mongodb').ObjectID;
const opportunity = require('../models/opportunity');



exports.newApplication = async (req,res) =>{

    try{
        const user = await User.findById(req.userData.user._id); 
        
        if (!user) {
            return res
            .status(409)
            .json({ message: "user  doesn't  exist ! " });
        }
        console.log(user)
        const opportunity = await Opportunity.findById(req.params.opportunityId); 
        
        if (!opportunity) {
            return res
            .status(409)
            .json({ message: "opportunity  doesn't  exist ! " });
        }

        const createdAt = new Date();

        let file = null ;
        if (req.files[0]!=undefined)
            file = req.files[0].path;

        const newApplication =await  Application.create({
            cv : file ,
            motivation : req.body.motivation ,
            user : req.userData.user._id ,
            opportunity : req.params.opportunityId ,
            createdAt : createdAt ,
            status : 'PENDING' 
        });
        await opportunity.applications.push(newApplication) ; 
        await opportunity.save() ; 
        console.log(newApplication) ; 
        await User.findOneAndUpdate(
            { _id :  req.userData.user._id } ,  
            { $push: { applications: newApplication }},
            {useFindAndModify: false},
            function(err, model) {
                console.log(err+" "+model);
            }
        )
        .exec() 
        .then(()=>{
            res.status(200).json(newApplication);
        }) ;  

    }catch (err){
        res.status(500).json({message : err}); 
        console.log(err) ;
    }


}


exports.getApplicationByUser = async (req,res) =>{
    try {
        const applications = await Application.find({
            user : req.userData.user._id,
        })
        .populate({
            path: 'opportunity',
            populate: { path: 'company' }
          })        
        .exec() ; 
        res.json(applications)
    }
    catch(err){
        res.status(400).json({message: err})
    }
}


exports.getApplicationById = async (req,res) =>{
    try {
        const application = await Application
        .findById(req.params.applicationId)
        .populate({
            path: 'opportunity',
            populate: { path: 'company' }
          })        
        .exec() ; 
 
        
        if (!application) {
            return res
            .status(409)
            .json({ message: "application  doesn't  exist ! " });
        }

        res.json(application) ; 
    }
    catch(err){
        res.status(400).json({message: err})
    }
}


exports.getApplicationByCompany= async (req,res) =>{
    try {
        const opportunities = await Opportunity
        .find({company : req.params.companyId}) 
        .populate({
            path: 'applications' , 
            populate :{
                path : 'opportunity' ,
                model : 'opportunity'
            }
        })        
        .populate({
            path: 'applications' ,         
            populate :{
                path : 'user',
                model : 'user'
            }
        })        
        .exec() ; 
        let applications = []; 
        for (let i=0 ; i< opportunities.length; i++){
            applications = applications.concat(opportunities[i].applications) ;  
        }
          

        res.json(applications) ; 
    }
    catch(err){
        res.status(400).json({message: err})
    }
}



exports.getApplicationByOpportunity = async (req,res) =>{
    try {

        const opportunity = await Opportunity
        .findById(req.params.opportunityId)
        .populate({
            path: 'opportunity',
            populate: { path: 'company' }
          })        
        .exec() ; 

        
        if (!opportunity) {
            return res
            .status(409)
            .json({ message: "opportunity  doesn't  exist ! " });
        }


        const applications = await Application.find({
            user : req.params.opportunityId,
        })
        res.json(applications)
    }
    catch(err){
        res.status(400).json({message: err})
    }
}
exports.deleteApplication = async (req,res) =>{
    try {
        const application = await Application.findById(req.params.applicationId); 
        
        if (!application) {
            return res
            .status(409)
            .json({ message: "application  doesn't  exist ! " });
        }

        await Opportunity.update(
            {  } ,  
            { $pull: { applications: { $in: [ req.params.applicationId ] } }},
            { multi: true }
        ).exec() ;  
   
        await Application.deleteOne({
            _id : req.params.applicationId
        }) ; 

        res.status(200).json({message : 'Successfully deleting Application '}); 
    }
    catch(err){
        res.status(400).json({message: err})
    }
}
exports.updateApplication = async (req,res) =>{
    try {
        const application = await Application.findById(req.params.applicationId); 
        
        if (!application) {
            return res
            .status(409)
            .json({ message: "application  doesn't  exist ! " });
        }
        
        const applicationUpdated =  await Application.findOneAndUpdate(
            
               { _id : ObjectID(req.params.applicationId) } ,  
                 {
                    $set : {
                        status : req.body.status
                    }
                 }
        ).exec() ;  

        await res.status(200).json(applicationUpdated); 
    }
    catch(err){
        res.status(400).json({message: err})
    }
}