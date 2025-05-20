const express = require("express");
const router = express.Router();
// Import authController
const {
  register,
  login,
  googleLogin,
  masjidRegister,
  masjidLogin,
  superAdminLogin, 
  updateSuperAdmin,
  getsuperAdmin,
  getUserProfile,
  updateUserProfile,
  
} = require("../controllers/authController");
////END Import authController////

// Import superController
const {
  getPendingMasjids,
  getApprovedMasjids,
  approveMasjid,
  getAllMasjids,
  setMasjidToPending,
} = require("../controllers/superController"); 
////END Import superController////

// Import masjidController
const { 
  getMasjidProfile,
  updateMasjidProfile,
  userMasjidJoin,
  getMasjidUsers,
  removeMasjidUser,
  getJoinedMasjidDetails,
  postAnnouncement,
  getUserAnnouncements,
  getMasjidAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  reactToAnnouncement,
} = require("../controllers/masjidController"); 
////END Import masjidController////

// Import prayerTimingController
const 
{
  updatePrayerTimings,
  getPrayerTimings,
}= require("../controllers/prayerTimingController");
////END Import prayerTimingController////

//authController
//user
router.post("/register", register);
router.post("/login", login);
router.get("/getUserProfile/:userId", getUserProfile); // Fetch user profile details
router.put("/updateUserProfile/:userId", updateUserProfile); // Update user profile details
router.post("/google", googleLogin);

//Masjid
router.post("/masjidRegister", masjidRegister);
router.post("/masjidLogin", masjidLogin);

//super admin 
router.post("/superAdminLogin", superAdminLogin);
router.put("/updateSuperAdmin/:superAdminId", updateSuperAdmin);
router.get("/getsuperAdmin/:superAdminId", getsuperAdmin);

//superController
router.get("/getPendingMasjids", getPendingMasjids); // Fetch pending admins
router.get("/getApprovedMasjids", getApprovedMasjids); // Fetch approved admins
router.put("/approveMasjid/:masjidId", approveMasjid); // Approve or reject admin
router.get("/getAllMasjids", getAllMasjids); // Fetch all masjids
router.put("/setMasjidToPending/:masjidId", setMasjidToPending); // Set masjid status to pending

//masjidController
router.get("/getMasjidProfile/:masjidId", getMasjidProfile);
router.put("/updateMasjidProfile/:masjidId",updateMasjidProfile);
router.post("/userMasjidJoin", userMasjidJoin); // Route to join a masjid
router.get("/getMasjidUsers/:masjidId", getMasjidUsers); // Fetch users who joined a masjid
router.post("/removeMasjidUser", removeMasjidUser); // Remove a user from a masjid
router.get("/getJoinedMasjidDetails/:userId", getJoinedMasjidDetails);// Fetch masjid details for the masjid the user has joined
router.post("/postAnnouncement", postAnnouncement); // Post an announcement
router.get("/getUserAnnouncements/:userId", getUserAnnouncements); // Fetch user announcements
router.get("/getMasjidAnnouncements/:masjidId", getMasjidAnnouncements);
router.put("/updateAnnouncement/:id", updateAnnouncement);
router.delete("/deleteAnnouncement/:id", deleteAnnouncement);
router.post("/reactToAnnouncement", reactToAnnouncement);

//prayerTimingController
router.put("/updatePrayerTimings/:masjidId", updatePrayerTimings);
router.get("/getPrayerTimings/:masjidId", getPrayerTimings);

module.exports = router;