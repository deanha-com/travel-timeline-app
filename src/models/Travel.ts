import mongoose from 'mongoose';

const travelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  entryDate: {
    type: Date,
    required: true
  },
  exitDate: Date,
  isHome: {
    type: Boolean,
    default: false
  },
  flagCode: {
    type: String,
    required: true
  }
});

export const Travel = mongoose.model('Travel', travelSchema);