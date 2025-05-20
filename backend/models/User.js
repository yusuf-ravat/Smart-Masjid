const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobileNumber: {
    type: String,
    validate: {
      validator: function(v) {
        // This regex validates international phone numbers with country code
        // Allows formats like: +1234567890, +1-234-567-890, +1 (234) 567-890
        return /^\+[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number! Must include country code (e.g., +1234567890)`
    }
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

module.exports = mongoose.model("User", userSchema);
