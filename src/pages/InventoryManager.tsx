import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Leaf, 
  Sparkles, 
  AlertCircle,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import { MenuItem, Category } from '../types';
import { api } from '../services/api';

export const InventoryManager: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const [items, cats] = await Promise.all([
        api.getMenuItems(),
        api.getCategories()
      ]);
      setMenuItems(items);
      setCategories(cats);
    } catch (err) {
      console.error('Inventory load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (item: MenuItem) => {
    const nextState = !item.isAvailable;
    try {
      await api.toggleItemAvailability(item._id, nextState);
      setMenuItems(prev =>
        prev.map(i => (i._id === item._id ? { ...i, isAvailable: nextState } : i))
      );
    } catch (err) {
      alert('Failed to update item availability');
    }
  };

  const handleOpenAdd = () => {
    setEditingItem({
      name: '',
      category: 'PAROTTA',
      price: 100,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      isVeg: false,
      isAvailable: true,
      isPopular: false,
      isSpecial: false,
      quickBillKey: null
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!editingItem || !editingItem.name || !editingItem.price) {
      alert('Please provide a valid dish name and price');
      return;
    }

    try {
      if (editingItem._id) {
        await api.updateMenuItem(editingItem._id, editingItem);
      } else {
        await api.createMenuItem(editingItem);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      loadInventory();
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the restaurant menu?`)) return;
    try {
      await api.deleteMenuItem(id);
      loadInventory();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kovai-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <Package size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">
              MENU & INVENTORY MANAGER
            </h1>
            <p className="text-xs text-slate-400">Control prices, availability, images & categories across all screens</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-kovai-500 to-amber-600 hover:from-kovai-600 hover:to-amber-700 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all"
        >
          <Plus size={16} />
          <span>Add New Dish Item</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6 shadow-lg flex flex-col sm:flex-row gap-3 justify-between items-center">
        
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-kovai-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-kovai-500 text-slate-950'
                : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {categories.map(c => (
            <button
              key={c._id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedCategory === c.name
                  ? 'bg-kovai-500 text-slate-950'
                  : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div
            key={item._id}
            className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between transition-all ${
              !item.isAvailable ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
            }`}
          >
            {/* Dish Photo */}
            <div className="relative h-36 bg-slate-850 rounded-xl overflow-hidden mb-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute top-2 left-2 flex gap-1">
                {item.isVeg ? (
                  <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Veg
                  </span>
                ) : (
                  <span className="bg-red-950/90 text-red-400 border border-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Non-Veg
                  </span>
                )}
                {item.isPopular && (
                  <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    🔥 Popular
                  </span>
                )}
              </div>
            </div>

            {/* Title & Price */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-white">{item.name}</h3>
                <span className="text-sm font-extrabold text-amber-400 font-mono">₹{item.price}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
            </div>

            {/* Controls */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              
              {/* Availability Toggle */}
              <button
                onClick={() => handleToggleStock(item)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  item.isAvailable
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                }`}
              >
                {item.isAvailable ? 'INSTOCK (Available)' : 'OUT OF STOCK'}
              </button>

              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700"
                title="Edit Item"
              >
                <Edit3 size={15} />
              </button>

              <button
                onClick={() => handleDeleteItem(item._id, item.name)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700"
                title="Delete Item"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">
                {editingItem._id ? 'Edit Dish Details' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Dish Name</label>
                <input
                  type="text"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Bun Parotta"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-kovai-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Category</label>
                  <select
                    value={editingItem.category || 'PAROTTA'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingItem.price || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-bold font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Food Image URL</label>
                <input
                  type="text"
                  value={editingItem.imageUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none text-[11px]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isVeg || false}
                    onChange={(e) => setEditingItem({ ...editingItem, isVeg: e.target.checked })}
                    className="rounded text-kovai-500"
                  />
                  <span>Pure Veg</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPopular || false}
                    onChange={(e) => setEditingItem({ ...editingItem, isPopular: e.target.checked })}
                    className="rounded text-kovai-500"
                  />
                  <span>Mark Best Seller 🔥</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-kovai-500 hover:bg-kovai-600 text-slate-950 font-bold rounded-xl text-xs transition-all"
              >
                Save Menu Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
