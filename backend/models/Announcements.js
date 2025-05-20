const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  masjidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Masjids",
    required: true,
    unique: true, // Ensure one document per masjid
    index: true
  },
  announcements: [{
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["general", "prayer", "event", "donation", "education", "emergency"],
      default: "general",
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    reactions: {
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 }
    },
    userReactions: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      reaction: {
        type: String,
        enum: ['like', 'dislike'],
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
});

// Compound index for efficient querying
announcementSchema.index({ masjidId: 1, "announcements.date": -1 });
announcementSchema.index({ masjidId: 1, "announcements.category": 1, "announcements.date": -1 });

// Virtual for engagement rate
announcementSchema.virtual('engagementRate').get(function() {
  const totalReactions = this.reactions.likes + this.reactions.dislikes;
  return totalReactions;
});

// Static method to get category icon
announcementSchema.statics.getCategoryIcon = function(category) {
  const icons = {
    general: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    prayer: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    event: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    donation: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    education: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
    emergency: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
  };
  return icons[category] || icons.general;
};

// Static method to get category name
announcementSchema.statics.getCategoryName = function(category) {
  const names = {
    general: "General",
    prayer: "Prayer Times",
    event: "Events",
    donation: "Donations",
    education: "Education",
    emergency: "Emergency"
  };
  return names[category] || "General";
};

module.exports = mongoose.model("Announcements", announcementSchema); 