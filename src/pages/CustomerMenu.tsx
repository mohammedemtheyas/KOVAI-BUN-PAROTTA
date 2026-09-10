import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Flame, 
  Leaf, 
  Utensils, 
  Sparkles, 
  Check, 
  Plus, 
  ChevronRight,
  Star
} from 'lucide-react';
import { MenuItem, Category } from '../types';
import { api } from '../services/api';

export const CustomerMenu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);

  useEffect(() => {
    loadMenuData();
  }, [selectedCategory, vegOnly]);

  const loadMenuData = async () => {
    setLoading(true);
    try {
      const [cats, items, popular] = await Promise.all([
        api.getCategories(),
        api.getMenuItems(selectedCategory === 'ALL' ? undefined : selectedCategory, undefined, vegOnly),
        api.getPopularItems()
      ]);
      setCategories(cats);
      setMenuItems(items);
      setPopularItems(popular);
    } catch (err) {
      console.error('Error loading digital menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setCart(prev => {
      const existing = prev.find(i => i.item._id === item._id);
      if (existing) {
        return prev.map(i => i.item._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalCartValue = cart.reduce((sum, i) => sum + i.item.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-charcoal-950 text-stone-100 flex flex-col font-sans pb-24">
      
      {/* Restaurant Digital Menu Hero Header */}
      <header className="relative bg-gradient-to-r from-charcoal-950 via-chilli-950 to-charcoal-950 border-b border-chilli-700/30 py-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-chilli-600/20 text-chilli-400 border border-chilli-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Digital Restaurant Menu & Photography</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            KOVAI BUN PAROTTA
          </h1>
          <p className="text-2xl font-serif text-turmeric-400 font-bold">
            கோவை பன் பரோட்டா
          </p>
          <p className="text-stone-300 font-extrabold text-base italic">
            “Hot. Flaky. Authentic.”
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400 font-semibold">
            <span className="flex items-center gap-1"><Check size={14} className="text-leaf-400" /> Hot Bun Parotta</span>
            <span className="flex items-center gap-1"><Check size={14} className="text-leaf-400" /> Spicy Salna Gravies</span>
            <span className="flex items-center gap-1"><Check size={14} className="text-leaf-400" /> Banana Leaf Steamed Parotta</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 space-y-8 flex-grow">

        {/* Search & Category Filter Bar */}
        <div className="bg-charcoal-900/90 backdrop-blur-md p-4 rounded-3xl border border-charcoal-800 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center sticky top-2 z-20">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search dishes (Bun Parotta, Biryani...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-950 border border-charcoal-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-turmeric-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-chilli-700 text-white shadow-md'
                  : 'bg-charcoal-800 text-stone-300 hover:bg-charcoal-750'
              }`}
            >
              All Dishes
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-chilli-700 text-white shadow-md'
                    : 'bg-charcoal-800 text-stone-300 hover:bg-charcoal-750'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
              vegOnly
                ? 'bg-leaf-500/20 text-leaf-400 border-leaf-500/50'
                : 'bg-charcoal-800 text-stone-400 border-charcoal-700 hover:text-white'
            }`}
          >
            <Leaf size={15} className={vegOnly ? 'text-leaf-400' : 'text-stone-500'} />
            <span>Pure Veg</span>
          </button>
        </div>

        {/* POPULAR TODAY SECTION */}
        {popularItems.length > 0 && !searchQuery && selectedCategory === 'ALL' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame size={22} className="text-chilli-500 fill-chilli-500" />
              <h2 className="text-lg font-black tracking-tight text-white uppercase">
                POPULAR TODAY
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularItems.slice(0, 3).map(item => (
                <div
                  key={'pop-' + item._id}
                  className="bg-charcoal-900 border border-chilli-600/30 rounded-3xl overflow-hidden shadow-2xl hover:border-chilli-600/60 transition-all flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden bg-charcoal-850">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-turmeric-500 to-chilli-600 text-charcoal-950 font-black text-xs uppercase px-2.5 py-1 rounded-lg shadow">
                      ★ TOP SELLER
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-extrabold text-base text-white">{item.name}</h3>
                          {item.tamilName && (
                            <span className="text-xs text-turmeric-400 font-serif block">{item.tamilName}</span>
                          )}
                        </div>
                        <span className="text-lg font-black text-turmeric-400 font-mono">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-charcoal-800">
                      <div className="flex items-center gap-1 text-xs text-turmeric-400 font-bold">
                        <Star size={14} className="fill-turmeric-400" />
                        <span>4.9 (480+ orders)</span>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                        className="flex items-center gap-1 bg-chilli-700 hover:bg-chilli-600 text-white font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all"
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FULL FOOD MENU GRID */}
        <section className="space-y-4">
          <h2 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Utensils size={18} className="text-turmeric-400" />
            <span>Full Restaurant Food Menu</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => (
              <div
                key={item._id}
                className="bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 rounded-3xl overflow-hidden shadow-xl transition-all flex flex-col group"
              >
                <div className="relative h-44 bg-charcoal-850 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-chilli-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-base text-white">{item.name}</h3>
                        {item.tamilName && (
                          <span className="text-xs text-turmeric-400 font-serif block">{item.tamilName}</span>
                        )}
                      </div>
                      <span className="text-base font-black text-turmeric-400 font-mono">₹{item.price}</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-2 border-t border-charcoal-800 flex justify-between items-center">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">{item.category}</span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      className="flex items-center gap-1 bg-chilli-700 hover:bg-chilli-600 text-white font-black px-3.5 py-1.5 rounded-xl text-xs transition-all disabled:opacity-50"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-gradient-to-r from-chilli-700 to-chilli-800 p-4 rounded-2xl shadow-2xl z-40 flex items-center justify-between text-white font-bold border border-chilli-500/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-charcoal-950 text-turmeric-400 flex items-center justify-center font-black text-sm font-mono">
              {totalCartCount}
            </div>
            <div>
              <p className="text-[10px] uppercase text-stone-200 font-bold">Selected Menu Items</p>
              <p className="text-base font-black font-mono text-turmeric-400">₹{totalCartValue.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={() => alert(`Pre-order total: ₹${totalCartValue}. Please inform the Kovai Bun Parotta POS operator!`)}
            className="flex items-center gap-1 bg-charcoal-950 hover:bg-charcoal-900 text-turmeric-400 px-4 py-2 rounded-xl text-xs font-black transition-all"
          >
            <span>Proceed</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
