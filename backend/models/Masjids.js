const mongoose = require("mongoose");
const crypto = require('crypto');
require('dotenv').config();

// Get encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  console.error('ENCRYPTION_KEY is not set in environment variables!');
  process.exit(1); // Exit if no encryption key is found
}

const IV_LENGTH = 16;

// Encryption function
const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'base64'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return original text if encryption fails
  }
};

// Decryption function
const decrypt = (text) => {
  if (!text) return text;
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'base64'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return text; // Return original text if decryption fails
  }
};

const masjidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  mobileNumber: {
    type: String,
    unique: true,
    required: [true, "Mobile number is required"],
    match: [/^\+?\d{10,15}$/, "Mobile number must be 10-15 digits, optionally starting with a +"],
  },
  // Masjid Details (only for regular admins)
  masjidName: { type: String },
  masjidLocation: { type: String },
  // New Masjid ID field
  masjidSaas: {
    type: String,
    unique: true,
    required: true,
    match: [/^\d{6}$/, "Masjid ID must be a 6-digit number"],
  },
  masjidType: {
    type: String,
    enum: ["normal", "jama"],
    required: true,
    default: "normal",
  },
  // Banking Details with encryption
  bankingDetails: {
    accountHolderName: {
      type: String,
      get: decrypt,
      set: encrypt,
    },
    accountNumber: {
      type: String,
      get: decrypt,
      set: encrypt,
    },
    bankName: {
      type: String,
      get: decrypt,
      set: encrypt,
    },
    ifscCode: {
      type: String,
      get: decrypt,
      set: encrypt,
    },
    branchName: {
      type: String,
      get: decrypt,
      set: encrypt,
    },
    upiId: {
      type: String,
      get: decrypt,
      set: encrypt,
    },
    isBankingEnabled: {
      type: Boolean,
      default: false
    }
  },
  // Type of admin
  role: { type: String, enum: ["admin", "super-admin"], default: "admin" },
  // Status (approval required for normal admins)
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  
  createdAt: { type: Date, default: Date.now }
});

// Enable virtuals and getters
masjidSchema.set('toJSON', { getters: true });
masjidSchema.set('toObject', { getters: true });

module.exports = mongoose.model("Masjids", masjidSchema);
