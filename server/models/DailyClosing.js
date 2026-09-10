import mongoose from 'mongoose';

const dailyClosingSchema = new mongoose.Schema({
  dateStr: { type: String, required: true, unique: true }, // e.g. "2026-09-04"
  totalOrders: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  cashSales: { type: Number, default: 0 },
  upiSales: { type: Number, default: 0 },
  cardSales: { type: Number, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
  cancelledOrders: { type: Number, default: 0 },
  netSales: { type: Number, default: 0 },
  closedBy: { type: String, default: 'Admin' },
  closedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const DailyClosing = mongoose.model('DailyClosing', dailyClosingSchema);
