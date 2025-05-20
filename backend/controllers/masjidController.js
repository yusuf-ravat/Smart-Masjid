const MasjidJoins = require("../models/MasjidJoins");
const User = require("../models/User");
const Masjid = require("../models/Masjids");
const bcrypt = require("bcrypt");
const Announcements = require("../models/Announcements");


// Fetch masjid profile
exports.getMasjidProfile = async (req, res) => {
  const { masjidId } = req.params;
  try {
    const masjidProfile = await Masjid.findById(masjidId);
    if (!masjidProfile) {
      return res.status(404).json({ error: "Masjid not found" });
    }
    res.json(masjidProfile);
  } catch (err) {
    console.error("Error fetching masjid profile:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update masjid profile
exports.updateMasjidProfile = async (req, res) => {
  const { masjidId } = req.params;
  const { 
    name, 
    email, 
    mobileNumber, 
    masjidName, 
    masjidLocation, 
    masjidType, 
    password,
    bankingDetails 
  } = req.body;

  try {
    const masjidProfile = await Masjid.findById(masjidId);
    if (!masjidProfile) {
      return res.status(404).json({ error: "Masjid not found" });
    }

    // Update fields if provided
    if (name) masjidProfile.name = name;
    if (email) masjidProfile.email = email;
    if (mobileNumber) masjidProfile.mobileNumber = mobileNumber;
    if (masjidName) masjidProfile.masjidName = masjidName;
    if (masjidLocation) masjidProfile.masjidLocation = masjidLocation;
    if (masjidType) masjidProfile.masjidType = masjidType;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      masjidProfile.password = hashedPassword;
    }

    // Update banking details if provided
    if (bankingDetails) {
      masjidProfile.bankingDetails = {
        accountHolderName: bankingDetails.accountHolderName,
        accountNumber: bankingDetails.accountNumber,
        bankName: bankingDetails.bankName,
        ifscCode: bankingDetails.ifscCode,
        branchName: bankingDetails.branchName,
        upiId: bankingDetails.upiId,
        isBankingEnabled: bankingDetails.isBankingEnabled
      };
    }

    await masjidProfile.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all masjids
exports.getPendingMasjid = async (req, res) => {
  const pendingMasjid = await Masjid.find({ status: "pending" });
  res.json(pendingMasjid);
};
// Fetch approved masjid
exports.approveMasjid = async (req, res) => {
  const { masjidId } = req.params;
  const { status } = req.body;

  const masjid = await Masjid.findById(masjidId);
  if (!masjid) return res.status(404).json({ error: "Masjid not found" });

  masjid.status = status;
  await masjid.save();

  // Send email
  const message = status === "approved"
    ? "Your Masjid admin registration has been approved. You can now log in."
    : "Your Masjid admin registration has been rejected.";
    
  await sendEmail(masjid.email, "Masjid Admin Approval", message);

  res.json({ message: `Admin ${status}` });
};

// userMasjidJoin
exports.userMasjidJoin = async (req, res) => {
  const { userId, masjidId } = req.body;

  try {
    // Find or create masjid join record
    let masjidJoin = await MasjidJoins.findOne({ masjidId });
    
    if (!masjidJoin) {
      masjidJoin = new MasjidJoins({ masjidId, joinedUsers: [] });
    }

    // Check if user has already joined any masjid
    const existingJoin = await MasjidJoins.findOne({
      "joinedUsers.userId": userId,
      "joinedUsers.status": "approved"
    });

    if (existingJoin) {
      return res.status(400).json({
        error: "You have already joined a masjid. You cannot join multiple masjids.",
      });
    }

    // Check if user has already requested to join this masjid
    const existingUserJoin = masjidJoin.joinedUsers.find(
      user => user.userId.toString() === userId
    );

    if (existingUserJoin) {
      return res.status(400).json({ error: "You have already requested to join this masjid." });
    }

    // Add user to joinedUsers array
    masjidJoin.joinedUsers.push({
      userId,
      status: "approved",
      joiningDate: new Date()
    });

    await masjidJoin.save();
    res.status(201).json({ message: "Successfully joined the masjid." });
  } catch (err) {
    res.status(500).json({ error: "Failed to join the masjid." });
  }
};

// Fetch users who joined a specific masjid
exports.getMasjidUsers = async (req, res) => {
  const { masjidId } = req.params;
  try {
    const masjidJoin = await MasjidJoins.findOne({ masjidId })
      .populate("joinedUsers.userId", "name email mobileNumber");

    if (!masjidJoin) {
      return res.status(404).json({ message: "No users found for this masjid." });
    }

    const masjid = await Masjid.findOne({ _id: masjidId }).select(
      "masjidName masjidLocation"
    );

    if (!masjid) {
      return res.status(404).json({ message: "Masjid not found." });
    }

    const users = masjidJoin.joinedUsers
      .filter(user => user.status === "approved")
      .map(user => ({
        userId: user.userId._id,
        name: user.userId.name,
        email: user.userId.email,
        mobileNumber: user.userId.mobileNumber,
        joiningDate: user.joiningDate,
        masjidName: masjid.masjidName,
        masjidLocation: masjid.masjidLocation,
      }));

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch masjid users." });
  }
};

// Remove a user from a masjid
exports.removeMasjidUser = async (req, res) => {
  const { userId, masjidId } = req.body;

  try {
    const masjidJoin = await MasjidJoins.findOne({ masjidId });
    if (!masjidJoin) {
      return res.status(404).json({ error: "Masjid join record not found." });
    }

    // Remove user from joinedUsers array
    masjidJoin.joinedUsers = masjidJoin.joinedUsers.filter(
      user => user.userId.toString() !== userId
    );

    await masjidJoin.save();
    res.status(200).json({ message: "User removed from the masjid successfully." });
  } catch (err) {
    console.error("Error removing masjid user:", err);
    res.status(500).json({ error: "Failed to remove user from the masjid." });
  }
};

// Fetch masjid details for the masjid the user has joined
exports.getJoinedMasjidDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const masjidJoins = await MasjidJoins.findOne({
      "joinedUsers.userId": userId,
      "joinedUsers.status": "approved"
    });

    if (!masjidJoins) {
      return res.status(404).json({ message: "You have not joined any masjid yet." });
    }
    const masjidDetails = await Masjid.findById(masjidJoins.masjidId).select(
      "masjidName masjidLocation"
    );
    if (!masjidDetails) {
      return res.status(404).json({ message: "Masjid details not found." });
    }

    res.status(200).json(masjidDetails);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch masjid details." });
  }
};

// Post announcement
exports.postAnnouncement = async (req, res) => {
  try {
    const { masjidId, content, category = "general" } = req.body;
    
    // Find or create the announcements document for this masjid
    let announcementsDoc = await Announcements.findOne({ masjidId });
    
    if (!announcementsDoc) {
      announcementsDoc = new Announcements({
        masjidId,
        announcements: []
      });
    }
    // Create new announcement
    const newAnnouncement = {
      content,
      category,
      date: new Date(),
      reactions: { likes: 0, dislikes: 0 },
      userReactions: [],
      isActive: true
    };
    // Add to announcements array
    announcementsDoc.announcements.unshift(newAnnouncement);
    await announcementsDoc.save();

    // Get joined users to notify
    const joinedUsers = await MasjidJoins.find({
      masjidId,
      status: "approved"
    }).populate("userId");

    // TODO: Implement notification logic here
    // For now, just log the number of users to notify

    res.status(201).json({
      success: true,
      message: "Announcement posted successfully",
      announcement: newAnnouncement,
      categoryName: Announcements.getCategoryName(category),
      categoryIcon: Announcements.getCategoryIcon(category),
      usersNotified: joinedUsers.length
    });
  } catch (error) {
    console.error("Error posting announcement:", error);
    res.status(500).json({
      success: false,
      error: "Failed to post announcement"
    });
  }
};

// Get user announcements
exports.getUserAnnouncements = async (req, res) => {
  try {
    const { userId } = req.params;
    const { category, page = 1, limit = 10 } = req.query;

    // Find user's joined masjid
    const joinRecord = await MasjidJoins.findOne({
      "joinedUsers.userId": userId,
      "joinedUsers.status": "approved"
    }).select("masjidId");

    if (!joinRecord) {
      return res.status(404).json({
        success: false,
        error: "User is not a member of any masjid"
      });
    }

    // Find announcements for the masjid
    const announcementsDoc = await Announcements.findOne({ masjidId: joinRecord.masjidId });
    
    if (!announcementsDoc) {
      return res.status(200).json({
        success: true,
        announcements: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          pages: 0
        }
      });
    }

    // Get masjid details including admin info
    const masjidDetails = await Masjid.findById(joinRecord.masjidId).select('name email');
    if (!masjidDetails) {
      return res.status(404).json({
        success: false,
        error: "Masjid details not found"
      });
    }

    // Filter announcements
    let filteredAnnouncements = announcementsDoc.announcements.filter(a => a.isActive);
    
    if (category) {
      filteredAnnouncements = filteredAnnouncements.filter(a => a.category === category);
    }

    // Sort by date (newest first)
    filteredAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = filteredAnnouncements.length;

    // Get paginated announcements
    const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

    // Add user reactions and admin details to each announcement
    const announcementsWithReactions = paginatedAnnouncements.map(announcement => {
      const userReaction = announcement.userReactions.find(
        reaction => reaction.userId.toString() === userId
      );
      return {
        ...announcement.toObject(),
        userReaction: userReaction ? userReaction.reaction : null,
        adminName: masjidDetails.name,
        adminEmail: masjidDetails.email
      };
    });

    res.status(200).json({
      success: true,
      announcements: announcementsWithReactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error getting user announcements:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get announcements"
    });
  }
};

// Get masjid announcements (admin view)
exports.getMasjidAnnouncements = async (req, res) => {
  try {
    const { masjidId } = req.params;
    const { category, page = 1, limit = 10 } = req.query;

    // Find announcements for the masjid
    const announcementsDoc = await Announcements.findOne({ masjidId });
    
    if (!announcementsDoc) {
      return res.status(200).json({
        success: true,
        announcements: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          pages: 0
        }
      });
    }

    // Filter announcements
    let filteredAnnouncements = announcementsDoc.announcements.filter(a => a.isActive);
    
    if (category) {
      filteredAnnouncements = filteredAnnouncements.filter(a => a.category === category);
    }

    // Sort by date (newest first)
    filteredAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = filteredAnnouncements.length;

    // Get paginated announcements
    const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

    // Get total joined users for engagement calculation
    const totalJoinedUsers = await MasjidJoins.countDocuments({
      masjidId,
      status: "approved"
    });

    // Add engagement metrics to each announcement
    const announcementsWithMetrics = paginatedAnnouncements.map(announcement => {
      const totalReactions = announcement.reactions.likes + announcement.reactions.dislikes;
      const engagementRate = totalJoinedUsers > 0 ? (totalReactions / totalJoinedUsers) * 100 : 0;

      return {
        ...announcement.toObject(),
        engagementRate: engagementRate.toFixed(1),
        totalReactions
      };
    });

    res.status(200).json({
      success: true,
      announcements: announcementsWithMetrics,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error getting masjid announcements:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get announcements"
    });
  }
};

// React to announcement
exports.reactToAnnouncement = async (req, res) => {
  try {
    const { announcementId, userId, reaction } = req.body;

    // Find the announcements document
    const announcementsDoc = await Announcements.findOne({
      "announcements._id": announcementId
    });

    if (!announcementsDoc) {
      return res.status(404).json({
        success: false,
        error: "Announcement not found"
      });
    }

    // Find the specific announcement
    const announcement = announcementsDoc.announcements.id(announcementId);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: "Announcement not found"
      });
    }

    // Check if user is an approved member
    const joinRecord = await MasjidJoins.findOne({
      "joinedUsers.userId": userId,
      masjidId: announcementsDoc.masjidId,
      "joinedUsers.status": "approved"
    });

    if (!joinRecord) {
      return res.status(403).json({
        success: false,
        error: "Only approved members can react to announcements"
      });
    }

    // Find existing reaction
    const existingReactionIndex = announcement.userReactions.findIndex(
      r => r.userId.toString() === userId
    );

    if (existingReactionIndex !== -1) {
      // Remove old reaction
      const oldReaction = announcement.userReactions[existingReactionIndex].reaction;
      announcement.reactions[oldReaction + "s"]--;
      announcement.userReactions.splice(existingReactionIndex, 1);
    }

    // Add new reaction
    announcement.userReactions.push({
      userId,
      reaction,
      date: new Date()
    });
    announcement.reactions[reaction + "s"]++;

    await announcementsDoc.save();

    res.status(200).json({ 
      success: true,
      message: "Reaction updated successfully",
      announcement
    });
  } catch (error) {
    console.error("Error reacting to announcement:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update reaction"
    });
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { content, category } = req.body;

    // Find the announcements document
    const announcementsDoc = await Announcements.findOne({
      "announcements._id": announcementId
    });

    if (!announcementsDoc) {
      return res.status(404).json({
        success: false,
        error: "Announcement not found"
      });
    }

    // Find the specific announcement
    const announcement = announcementsDoc.announcements.id(announcementId);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: "Announcement not found"
      });
    }

    // Update fields if provided
    if (content) announcement.content = content;
    if (category) announcement.category = category;

    await announcementsDoc.save();

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      announcement
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update announcement"
    });
  }
};

// Delete announcement (soft delete)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    // Find the announcements document
    const announcementsDoc = await Announcements.findOne({
      "announcements._id": announcementId
    });

    if (!announcementsDoc) {
      return res.status(404).json({
        success: false,
        error: "Announcement not found"
      });
    }

    // Find the specific announcement
    const announcement = announcementsDoc.announcements.id(announcementId);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: "Announcement not found"
      });
    }

    // Soft delete by setting isActive to false
    announcement.isActive = false;
    await announcementsDoc.save();

    res.status(200).json({ 
      success: true,
      message: "Announcement deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete announcement"
    });
  }
};