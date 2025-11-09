import Match from '../models/Match.js';

// Get all matches
export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single match
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new match
export const createMatch = async (req, res) => {
  const match = new Match(req.body);

  try {
    const newMatch = await match.save();
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update match
export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete match
export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
