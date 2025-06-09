const Event = require('../models/Event');
const Masjid = require('../models/Masjids');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, contribution, maxParticipants } = req.body;
    const masjidId = req.body.masjidId;
    // Verify if the masjid exists
    const masjid = await Masjid.findById(masjidId);
    if (!masjid) {
      return res.status(404).json({ message: 'Masjid not found' });
    }

    // Create new event
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      contribution: contribution || 0,
      maxParticipants: maxParticipants || null,
      masjidId
    });

    // Save the event
    const savedEvent = await event.save();

    // Populate the event with masjid details
    await savedEvent.populate('_id.masjidId', 'masjidName');

    res.status(201).json({
      message: 'Event created successfully',
      event: savedEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      message: 'Failed to create event',
      error: error.message 
    });
  }
};

// Get all events for a masjid
exports.getMasjidEvents = async (req, res) => {
  try {
    const { masjidId } = req.params;
    // Verify if the masjid exists
    const masjid = await Masjid.findById(masjidId);
    if (!masjid) {
      return res.status(404).json({ message: 'Masjid not found' });
    }

    const events = await Event.find({ masjidId })
      .sort({ date: 1 })
      .populate('participants', 'name email')
      .populate('_id.masjidId', 'masjidName');

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      message: 'Failed to fetch events',
      error: error.message 
    });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the event and verify it belongs to the masjid
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('_id.masjidId', 'masjidName');

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ 
      message: 'Failed to update event',
      error: error.message 
    });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the event and verify it exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      message: 'Failed to delete event',
      error: error.message 
    });
  }
};

// Join an event
exports.joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already a participant
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: 'User is already registered for this event' });
    }

    // Check if event is full
    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.participants.push(userId);
    await event.save();

    res.json({
      message: 'Successfully joined the event',
      event: await event.populate('participants', 'name email')
    });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ 
      message: 'Failed to join event',
      error: error.message 
    });
  }
};

// Leave an event
exports.leaveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Remove user from participants
    event.participants = event.participants.filter(
      participant => participant.toString() !== userId
    );

    await event.save();
    res.json({
      message: 'Successfully left the event',
      event: await event.populate('participants', 'name email')
    });
  } catch (error) {
    console.error('Error leaving event:', error);
    res.status(500).json({ 
      message: 'Failed to leave event',
      error: error.message 
    });
  }
}; 