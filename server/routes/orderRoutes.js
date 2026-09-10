import express from 'express';
import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { memoryData } from '../inMemoryStore.js';
import { isConnected } from '../config/db.js';

const router = express.Router();

const generateOrderNumber = async () => {
  try {
    if (isConnected) {
      const lastOrder = await Order.findOne().sort({ createdAt: -1 });
      if (lastOrder && lastOrder.orderNumber) {
        const lastNum = parseInt(lastOrder.orderNumber.replace('KB-', '').replace('KB', ''), 10);
        const nextNum = isNaN(lastNum) ? 1001 : lastNum + 1;
        return `KB-${nextNum}`;
      }
    }
  } catch (err) {}
  const nextNum = 1000 + memoryData.orders.length + 1;
  return `KB-${nextNum}`;
};

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const { search, orderType, paymentMethod, status } = req.query;

    if (isConnected) {
      let filter = {};
      if (search) {
        filter.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { tableNumber: { $regex: search, $options: 'i' } },
          { cashierName: { $regex: search, $options: 'i' } },
          { 'items.name': { $regex: search, $options: 'i' } }
        ];
      }
      if (orderType && orderType !== 'ALL') filter.orderType = orderType;
      if (paymentMethod && paymentMethod !== 'ALL') filter.paymentMethod = paymentMethod;
      if (status && status !== 'ALL') filter.status = status;

      const orders = await Order.find(filter).sort({ createdAt: -1 });
      if (orders.length > 0) return res.json(orders);
    }

    let orders = [...memoryData.orders];
    if (orderType && orderType !== 'ALL') orders = orders.filter(o => o.orderType === orderType);
    if (paymentMethod && paymentMethod !== 'ALL') orders = orders.filter(o => o.paymentMethod === paymentMethod);
    if (status && status !== 'ALL') orders = orders.filter(o => o.status === status);

    return res.json(orders);
  } catch (err) {
    return res.json(memoryData.orders);
  }
});

// GET /api/orders/kds/active
router.get('/kds/active', async (req, res) => {
  try {
    if (isConnected) {
      const activeOrders = await Order.find({
        status: { $in: ['NEW', 'PREPARING', 'READY'] }
      }).sort({ createdAt: 1 });
      if (activeOrders.length > 0) return res.json(activeOrders);
    }
    const active = memoryData.orders.filter(o => ['NEW', 'PREPARING', 'READY'].includes(o.status));
    return res.json(active);
  } catch (err) {
    return res.json([]);
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { items, orderType, tableNumber, discount, taxRate, paymentMethod, amountReceived, notes, cashierName } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let subtotalCents = 0;
    for (const item of items) {
      subtotalCents += Math.round(item.price * 100) * item.quantity;
    }
    const subtotal = subtotalCents / 100;
    const discountVal = parseFloat(discount) || 0;
    const taxableSubtotal = Math.max(0, subtotal - discountVal);
    const taxRateVal = parseFloat(taxRate) || 5;
    const taxVal = Math.round(taxableSubtotal * (taxRateVal / 100) * 100) / 100;
    const grandTotal = Math.round((taxableSubtotal + taxVal) * 100) / 100;
    const receivedVal = parseFloat(amountReceived) || grandTotal;
    const changeVal = Math.max(0, Math.round((receivedVal - grandTotal) * 100) / 100);

    const orderNumber = await generateOrderNumber();

    const orderObj = {
      _id: `ord-${Date.now()}`,
      orderNumber,
      orderType: orderType || 'Dine In',
      tableNumber: orderType === 'Dine In' ? (tableNumber || 'Table 01') : 'N/A',
      items,
      subtotal,
      discount: discountVal,
      tax: taxVal,
      taxRate: taxRateVal,
      grandTotal,
      paymentMethod: paymentMethod || 'Cash',
      amountReceived: receivedVal,
      change: changeVal,
      paymentStatus: 'Paid',
      status: 'NEW',
      cashierName: cashierName || 'Kovai POS Operator',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isConnected) {
      try {
        const newOrder = new Order(orderObj);
        await newOrder.save();
        return res.status(201).json(newOrder);
      } catch (e) {}
    }

    memoryData.orders.unshift(orderObj);
    return res.status(201).json(orderObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (isConnected) {
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (order) return res.json(order);
    }
    const idx = memoryData.orders.findIndex(o => o._id === req.params.id);
    if (idx > -1) {
      memoryData.orders[idx].status = status;
      return res.json(memoryData.orders[idx]);
    }
    return res.status(404).json({ error: 'Order not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
