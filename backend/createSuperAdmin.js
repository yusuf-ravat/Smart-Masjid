const mongoose = require("mongoose");
const SuperAdmin = require("./models/superadmin");

mongoose.connect("mongodb://localhost:27017/smart-masjid", { useNewUrlParser: true, useUnifiedTopology: true });

const createSuperAdmin = async () => {
  try {
    const superAdmin = new SuperAdmin({
      name: "Super Admin",
      email: "superadmin@example.com",
      password: "123", // This will be hashed automatically
    });
    await superAdmin.save();
  
    mongoose.disconnect();
  } catch (err) {
    console.error("Error creating Super Admin:", err);
    mongoose.disconnect();
  }
};

createSuperAdmin();