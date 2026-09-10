import express from 'express';
import { MenuItem } from '../models/MenuItem.js';
import { Category } from '../models/Category.js';
import { memoryData } from '../inMemoryStore.js';
import { isConnected } from '../config/db.js';

const router = express.Router();

// GET /api/menu/categories
router.get('/categories', async (req, res) => {
  try {
    if (isConnected) {
      const categories = await Category.find().sort({ sortOrder: 1 });
      if (categories.length > 0) return res.json(categories);
    }
    return res.json(memoryData.categories);
  } catch (err) {
    return res.json(memoryData.categories);
  }
});

// GET /api/menu
router.get('/', async (req, res) => {
  try {
    const { category, search, vegOnly } = req.query;

    if (isConnected) {
      let filter = {};
      if (category && category !== 'ALL') filter.category = category;
      if (search) filter.name = { $regex: search, $options: 'i' };
      if (vegOnly === 'true') filter.isVeg = true;

      const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
      if (items.length > 0) return res.json(items);
    }

    // Memory Fallback
    let items = [...memoryData.menuItems];
    if (category && category !== 'ALL') {
      items = items.filter(i => i.category === category);
    }
    if (search) {
      items = items.filter(i => i.name.toLowerCase().includes(search.toString().toLowerCase()));
    }
    if (vegOnly === 'true') {
      items = items.filter(i => i.isVeg);
    }

    return res.json(items);
  } catch (err) {
    return res.json(memoryData.menuItems);
  }
});

// POST /api/menu
router.post('/', async (req, res) => {
  try {
    if (isConnected) {
      const newItem = new MenuItem(req.body);
      await newItem.save();
      return res.status(201).json(newItem);
    }
    const fakeId = `m-${Date.now()}`;
    const newItem = { _id: fakeId, ...req.body };
    memoryData.menuItems.push(newItem);
    return res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/menu/:id
router.put('/:id', async (req, res) => {
  try {
    if (isConnected) {
      const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (updated) return res.json(updated);
    }
    const idx = memoryData.menuItems.findIndex(i => i._id === req.params.id);
    if (idx > -1) {
      memoryData.menuItems[idx] = { ...memoryData.menuItems[idx], ...req.body };
      return res.json(memoryData.menuItems[idx]);
    }
    return res.status(404).json({ error: 'Item not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/menu/:id/availability
router.patch('/:id/availability', async (req, res) => {
  try {
    const { isAvailable } = req.body;
    if (isConnected) {
      const updated = await MenuItem.findByIdAndUpdate(
        req.params.id,
        { isAvailable },
        { new: true }
      );
      if (updated) return res.json(updated);
    }
    const idx = memoryData.menuItems.findIndex(i => i._id === req.params.id);
    if (idx > -1) {
      memoryData.menuItems[idx].isAvailable = isAvailable;
      return res.json(memoryData.menuItems[idx]);
    }
    return res.status(404).json({ error: 'Item not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/menu/:id
router.delete('/:id', async (req, res) => {
  try {
    if (isConnected) {
      await MenuItem.findByIdAndDelete(req.params.id);
    }
    memoryData.menuItems = memoryData.menuItems.filter(i => i._id !== req.params.id);
    return res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
