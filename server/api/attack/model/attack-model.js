import mongoose from "mongoose";

const _attackSchema = {
  createdAt: {type: Date, default: Date.now},
  armies: [{
    name: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    timeToTarget: {type: Number, default: 0},
    speedMultiplier: {type: Number, min: 1, max: 6, default: 1},
    delay: {type: Number, default: 0}
  }],
  time: { type: Date, required: true },
  village: {type: String, required: true, trim: true}
}

export default mongoose.Schema(_attackSchema);
