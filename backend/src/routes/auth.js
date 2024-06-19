const express = require("express");
const router = express.Router();
const {
  getUsers,
  register,
  login,
  dashboard,
  logout,
  hospital,
  gethospitals,
  addUserTreatmentPlan,
  getUserTreatmentPlan,
  deleteUserTreatmentPlan,
  gethospitalsbyid,
  addreviews,
  getaveragerating,
  getHospitalRating,
  addHospitalRating,
} = require("../controllers/auth");

const {
  validationMiddleware,
} = require("../middlewares/validations-middleware");
const { registerValidation, loginValidation } = require("../validators/auth");
const { userAuth } = require("../middlewares/passport-middleware");

// Define routes
router.get("/get-users", getUsers);
// Register route with middleware for validation
router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/dashboard", userAuth, dashboard);
router.get("/logout", logout);
router.post("/hospitals", hospital);
router.get("/get-hospitals", gethospitals);
router.post("/treatmentplan", addUserTreatmentPlan);
router.get("/get-treatmentplan/:userId", getUserTreatmentPlan);
router.delete("/delete-treatmentplan/:userId/:planId", deleteUserTreatmentPlan);
router.get("/get-hospital-info/:hospital_id", gethospitalsbyid);
router.post("/hospital-review/:user_id/:hospital_id", addreviews);
router.get("/get-hospital-review/:hospital_id", getaveragerating);
router.get("/", (req, res) => {
  return res.send("API is working!");
});

module.exports = router;
