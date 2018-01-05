import mongoose from "mongoose";

const _attackSchema = {
  createdAt: {type: Date, default: Date.now},
  armies: [{
    name: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    timeToTarget: {type: Number, default: 0},
    speedMultiplier: {type: Number, min: 1, max: 4, default: 1},
    interval: {type: Number, default: 5},
  }],
  time: { type: Date }
}

export default mongoose.Schema(_attackSchema);
