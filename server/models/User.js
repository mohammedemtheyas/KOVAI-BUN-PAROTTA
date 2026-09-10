import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Kovai Parotta Operator' },
  username: { type: String, required: true, unique: true, default: 'admin' },
  password: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
