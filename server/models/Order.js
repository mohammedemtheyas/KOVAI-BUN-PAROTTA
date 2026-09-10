import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  notes: { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  orderType: { type: String, enum: ['Dine In', 'Takeaway', 'Parcel'], default: 'Dine In' },
  tableNumber: { type: String, default: 'Table 01' },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 }, // GST amount
  taxRate: { type: Number, default: 5 }, // GST %
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Card'], default: 'Cash' },
  amountReceived: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Cancelled'], default: 'Paid' },
  status: { type: String, enum: ['NEW', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'], default: 'NEW' },
  cashierName: { type: String, default: 'Cashier' },
  notes: { type: String, default: '' },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
