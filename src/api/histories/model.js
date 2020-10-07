const mongoose = require('mongoose');

const HistorySchema = mongoose.Schema(
  {
    userInfo: {
      type: Object,
      default: null,
    },
    ipDetails: { type: Object, default: null },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        // index: '2dsphere'
      },
      // formattedAddress: String,
    },
  },
  {
    timestamps: true,
  }
);
HistorySchema.index({ location: '2dsphere' });
const History = mongoose.model('History', HistorySchema);
module.exports = History;
