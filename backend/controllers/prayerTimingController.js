const PrayerTiming = require("../models/PrayerTiming");

// Update prayer timings
exports.updatePrayerTimings = async (req, res) => {
  try {
    const { masjidId } = req.params;
    const { timings } = req.body;
    

    // Validate all required timings are present
    const requiredTimings = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jummah', 'eidUlFitr', 'eidUlAdha'];
    const missingTimings = requiredTimings.filter(timing => !timings[timing]);
    
    if (missingTimings.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required timings: ${missingTimings.join(', ')}`
      });
    }

    // Update or create prayer timings
    const prayerTiming = await PrayerTiming.findOneAndUpdate(
      { masjidId },
      { 
        timings,
        lastUpdated: new Date()
      },
      { 
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Prayer timings updated successfully",
      prayerTiming
    });
  } catch (error) {
    console.error("Error updating prayer timings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update prayer timings"
    });
  }
};

// Get prayer timings for a masjid
exports.getPrayerTimings = async (req, res) => {
  try {
    const { masjidId } = req.params;

    const prayerTiming = await PrayerTiming.findOne({ masjidId });

    if (!prayerTiming) {
      return res.status(404).json({
        success: false,
        error: "Prayer timings not found for this masjid"
      });
    }

    res.status(200).json({
      success: true,
      prayerTiming
    });
  } catch (error) {
    console.error("Error getting prayer timings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get prayer timings"
    });
  }
}; 