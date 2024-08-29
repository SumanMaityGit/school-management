const express = require("express");
const {
  getAllSchools,
  addSchool,
} = require("../controllers/schoolControllers");
const router = express.Router();

router.get("/listSchools", getAllSchools);
router.post("/addSchool", addSchool);

module.exports = router;
