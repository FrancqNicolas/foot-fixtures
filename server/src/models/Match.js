import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  matchId: {
    type: Number,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  team1: {
    name: {
      type: String,
      required: true
    },
    logoUrl: {
      type: String,
      default: null
    },
    score: {
      type: Number,
      default: null
    }
  },
  team2: {
    name: {
      type: String,
      required: true
    },
    logoUrl: {
      type: String,
      default: null
    },
    score: {
      type: Number,
      default: null
    }
  },
  date: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'finished'],
    default: 'scheduled'
  },
  minute: {
    type: Number,
    default: null
  },
  competition: {
    type: String,
    default: 'UEFA Champions League'
  },
  stage: {
    type: String,
    default: 'Quarter-Finals'
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  events: {
    type: Array,
    default: []
  },
  lineups: {
    type: Array,
    default: []
  },
  detailsFetchedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Match = mongoose.model('Match', matchSchema);

export default Match;
