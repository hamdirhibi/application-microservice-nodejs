const express = require("express");
const router = express.Router();
const applicationControlller = require("../controllers/application");
const checkAuth = require("../middleware/checkAuth");

let upload = require('../config/multer.config.js');

router.post("/:opportunityId", checkAuth, upload.any() , applicationControlller.newApplication);
router.get("/:applicationId", checkAuth ,  applicationControlller.getApplicationById);
router.get("/company/:companyId", checkAuth ,  applicationControlller.getApplicationByCompany);
router.get("/", checkAuth ,  applicationControlller.getApplicationByUser);
router.get("/opportunity/:opportunityId", checkAuth ,  applicationControlller.getApplicationByOpportunity);
router.delete("/:applicationId", checkAuth ,  applicationControlller.deleteApplication);
router.put("/:applicationId", checkAuth ,  applicationControlller.updateApplication);



module.exports = router ; 
    