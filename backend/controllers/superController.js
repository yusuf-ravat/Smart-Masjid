const Masjid = require("../models/Masjids");
const nodemailer = require("nodemailer");

//Fetch all masjids
exports.getAllMasjids = async (req, res) => {
  try {
    const allmasjids = await Masjid.find();
    res.status(200).json(allmasjids);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch masjids." });
  }
}
// Fetch pending admins
exports.getPendingMasjids = async (req, res) => {
  try {
    const pendingMasjid = await Masjid.find({ status: "pending" });
    res.status(200).json(pendingMasjid);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending admins." });
  }
};

// Fetch approved Masjid
exports.getApprovedMasjids = async (req, res) => {
  
  try {
    const approvedMasjid = await Masjid.find({ status: "approved" });
    res.status(200).json(approvedMasjid);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch approved admins." });
  }
};

// Approve or reject an Masjid
exports.approveMasjid = async (req, res) => {
  const { masjidId } = req.params;
  const { status } = req.body; // Status will be "approved" or "rejected"
  try {
    const masjid = await Masjid.findById(masjidId);
    if (!masjid) return res.status(404).json({ error: "Masjid not found" });

    masjid.status = status; // Update the status
    await masjid.save();
    res.status(200).json({ message: `Masjid status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update admin status." });
  }
};

// Set masjid status to pending
exports.setMasjidToPending = async (req, res) => {
  const { masjidId } = req.params;
  try {
    const masjid = await Masjid.findById(masjidId);
    if (!masjid) return res.status(404).json({ error: "Masjid not found" });

    masjid.status = "pending"; // Set status to pending
    await masjid.save();

    res.status(200).json({ message: "Masjid status set to pending." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update masjid status." });
  }
};