const express = require("express");
const familyProfileControlers = require("../Controllers/familyProfileControlers");
const { isAdmin, authMiddleware } = require("../Middleware/authMiddleware");
const router = express.Router();

// router.use(authMiddleware); 
router.post(
    "/add/family/members",
    familyProfileControlers.addFamilMembers
);
router.get(
    "/get/family/members/:id",
    familyProfileControlers.getFamilMembers
);
router.get(
    "/get/source-of-neutrents/:id",
    familyProfileControlers.UsedNeutrents
);


router.post('/add/source/price',familyProfileControlers.addSourseToDaily)
router.post('/get/source/price',familyProfileControlers.getSourseToDaily)

module.exports = router;
