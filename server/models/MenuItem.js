import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tamilName: { type: String, default: '' },
  category: { type: String, required: true }, // e.g. 'Parotta', 'Biryani', 'Chicken', 'Rice & Noodles', 'Egg', 'Dosa', 'Veg', 'Beverages'
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  isVeg: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  rating: { type: Number, default: 4.8 },
  preparationTime: { type: String, default: '10-15 mins' },
  tags: [{ type: String }],
  quickBillKey: { type: Number, default: null }, // 1, 2, 3, 4, 5 for Quick Bill hotkeys
  orderCount: { type: Number, default: 0 },
}, { timestamps: true });

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
