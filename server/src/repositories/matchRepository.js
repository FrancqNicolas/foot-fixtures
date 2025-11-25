import Match from '../models/Match.js';

export const matchRepository = {
  findAll: async (sortOptions = { createdAt: 1 }) => {
    return Match.find().sort(sortOptions);
  },

  findById: async (id) => {
    return Match.findById(id);
  },

  findByMatchId: async (matchId) => {
    return Match.findOne({ matchId: parseInt(matchId) });
  },

  create: async (data) => {
    const match = new Match(data);
    return match.save();
  },

  createMany: async (matches) => {
    return Match.insertMany(matches);
  },

  update: async (id, data) => {
    return Match.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  delete: async (id) => {
    return Match.findByIdAndDelete(id);
  },

  deleteAll: async () => {
    return Match.deleteMany({});
  },

  updateDetails: async (matchId, details, events, lineups) => {
    const match = await Match.findOne({ matchId: parseInt(matchId) });
    if (!match) return null;

    match.details = details;
    match.events = events;
    match.lineups = lineups;
    match.detailsFetchedAt = new Date();
    return match.save();
  }
};
