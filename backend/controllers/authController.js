//authController
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Masjid = require("../models/Masjids");
const nodemailer = require("nodemailer");
const SuperAdmin = require("../models/superadmin");

// Helper function to generate a unique 6-digit masjidSaas
const generateUniqueMasjidId = async () => {
  const maxAttempts = 10; // Prevent infinite loops
  let attempts = 0;

  while (attempts < maxAttempts) {
    // Generate a random 6-digit number (100000 to 999999)
    const masjidSaas = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Check if masjidSaas already exists
    const existingMasjidSaas = await Masjid.findOne({ masjidSaas });
    if (!existingMasjidSaas) {
      return masjidSaas;
    }
    attempts++;
    
  }
  throw new Error("Unable to generate a unique Masjid ID after multiple attempts");
};

// User Registration
exports.register = async (req, res) => {
  const { name, email, password, role, mobileNumber } = req.body;
  try {
    // Check if mobile number is valid
    if (mobileNumber && !/^\+[1-9]\d{1,14}$/.test(mobileNumber)) {
      return res.status(400).json({ error: "Invalid mobile number format. Must include country code (e.g., +1234567890)" });
    }

    // Check if mobile number already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ error: "Mobile number is already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, mobileNumber });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      if (err.keyPattern.email) {
        res.status(400).json({ error: "Email already exists" });
      } else if (err.keyPattern.mobileNumber) {
        res.status(400).json({ error: "Mobile number already exists" });
      } else {
        res.status(400).json({ error: "Duplicate entry" });
      }
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      role: user.role,
      name: user.name,
      _id: user._id,
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Fetch getUserProfile
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(userProfile);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: err.message });
  }
};


// Update updateUserProfile
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, mobileNumber } = req.body;

  try {
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if mobile number is valid
    if (mobileNumber && !/^\+[1-9]\d{1,14}$/.test(mobileNumber)) {
      return res.status(400).json({ error: "Invalid mobile number format. Must include country code (e.g., +1234567890)" });
    }

    // Check if mobile number is already used by another user
    if (mobileNumber && mobileNumber !== userProfile.mobileNumber) {
      const existingUser = await User.findOne({ mobileNumber });
      if (existingUser) {
        return res.status(400).json({ error: "Mobile number is already registered" });
      }
    }

    // Update fields if provided
    if (name) userProfile.name = name;
    if (email) userProfile.email = email;
    if (mobileNumber) userProfile.mobileNumber = mobileNumber;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userProfile.password = hashedPassword;
    }

    await userProfile.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/// Google login
exports.googleLogin = async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "", // Google login doesn't need a password
        role: "user",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Server error during Google login" });
  }
};

// Utility to send emails
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

// masjid Registration
exports.masjidRegister = async (req, res) => {
  
  const { name, email, password, mobileNumber, masjidName, masjidLocation, masjidType } = req.body;
    try {

  // Check if the email or mobileNumber is already registered
  const existingMasjid = await Masjid.findOne({ $or: [{ email }, { mobileNumber }] });
 
  if (existingMasjid) {
    if (existingMasjid.email === email) {
      return res.status(400).json({ error: "Email is already registered" });
      
    }
    if (existingMasjid.mobileNumber === mobileNumber) {
      return res.status(400).json({ error: "Mobile number is already registered" });
    }
  }
    // Generate unique masjidSaas
    const masjidSaas = await generateUniqueMasjidId();

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Masjid.create({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
      masjidName,
      masjidLocation,
      masjidSaas,
      masjidType, // Add masjidType to the admin document
      role: "admin",
      status: "pending",//approved
    });    res.status(201).json({ message: "masjid created", admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// masjid Login
exports.masjidLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const masjid = await Masjid.findOne({ email });
    if (!masjid) return res.status(400).json({ error: "masjid not found" });

    const isMatch = await bcrypt.compare(password, masjid.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ masjid: masjid._id, role: masjid.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
      
    res.json({
      token,
      masjidId: masjid._id,
      role: masjid.role,
      name: masjid.name,
      status: masjid.status,
      masjidSaas: masjid.masjidSaas,
      masjidType: masjid.masjidType,
      mobileNumber: masjid.mobileNumber,
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Super Admin Login
exports.superAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await SuperAdmin.findOne({ email });
    if (!admin) return res.status(404).json({ error: "Super admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, name: admin.name, email: admin.email, adminId: admin._id }); // Ensure adminId is included
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again." });
  }
};
// Update super admin details
exports.updateSuperAdmin = async (req, res) => {
  const { adminId } = req.params;
  const { name, email, password } = req.body;

  try {
    const admin = await SuperAdmin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Super admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword; // Hash the password manually
    }

    await admin.save({ validateBeforeSave: false }); // Skip pre("save") middleware
    res.json({ message: "Super admin details updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  
// Get super admin details
exports.getsuperAdmin = async (req, res) => {
  const { superAdminId } = req.params;
  try {
    const admin = await SuperAdmin.findById(superAdminId).select("name email");
    if (!admin) {
      return res.status(404).json({ error: "Super admin not found" });
    }

    res.json({ name: admin.name, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// // Fetch all masjids
// exports.getPendingAdmins = async (req, res) => {
//   const pendingAdmins = await Admin.find({ status: "pending" });
//   res.json(pendingAdmins);
// };
// // Fetch approved admins
// exports.approveAdmin = async (req, res) => {
//   const { masjidId } = req.params;
//   const { status } = req.body;

//   const admin = await Admin.findById(masjidId);
//   if (!admin) return res.status(404).json({ error: "Admin not found" });

//   admin.status = status;
//   await admin.save();

//   // Send email
//   const message = status === "approved"
//     ? "Your Masjid admin registration has been approved. You can now log in."
//     : "Your Masjid admin registration has been rejected.";
    
//   await sendEmail(admin.email, "Masjid Admin Approval", message);

//   res.json({ message: `Admin ${status}` });
// };



