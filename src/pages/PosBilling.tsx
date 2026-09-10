import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Utensils, 
  Zap, 
  CheckCircle2, 
  PauseCircle, 
  XCircle,
  Flame
} from 'lucide-react';
import { MenuItem, Category, OrderItem, OrderType, PaymentMethod, Order } from '../types';
import { api } from '../services/api';
import { ReceiptModal } from '../components/ReceiptModal';
import { QuickBillModal } from '../components/QuickBillModal';
import { UpiPaymentModal } from '../components/UpiPaymentModal';
import confetti from 'canvas-confetti';

export const PosBilling: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Billing Order State
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('Dine In');
  const [selectedTable, setSelectedTable] = useState<string>('Table 07');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(5); // 5% GST
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Held Orders State
  const [heldOrders, setHeldOrders] = useState<{ id: string; table: string; items: OrderItem[] }[]>([]);

  // Modals
  const [isQuickBillOpen, setIsQuickBillOpen] = useState<boolean>(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState<boolean>(false);
  const [generatedOrder, setGeneratedOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, items] = await Promise.all([
        api.getCategories(),
        api.getMenuItems()
      ]);
      setCategories(cats);
      setMenuItems(items);
    } catch (err) {
      console.error('Failed to load POS data:', err);
    }
  };

  const addItemToOrder = (item: MenuItem, qtyOverride?: number) => {
    if (!item.isAvailable) return;
    const addQty = qtyOverride || 1;

    setCurrentOrderItems(prev => {
      const existingIdx = prev.findIndex(i => i.menuItemId === item._id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += addQty;
        return updated;
      }
      return [...prev, {
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: addQty,
        notes: ''
      }];
    });
  };

  const updateItemQty = (index: number, delta: number) => {
    setCurrentOrderItems(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setCurrentOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  // Safe Currency Math
  const subtotalCents = currentOrderItems.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  const subtotal = subtotalCents / 100;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const taxVal = Math.round(taxableSubtotal * (taxRate / 100) * 100) / 100;
  const grandTotal = Math.round((taxableSubtotal + taxVal) * 100) / 100;

  const numReceived = parseFloat(amountReceived) || grandTotal;
  const changeVal = Math.max(0, Math.round((numReceived - grandTotal) * 100) / 100);

  // Hold & Resume
  const handleHoldOrder = () => {
    if (currentOrderItems.length === 0) return;
    const newHold = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      table: selectedTable,
      items: currentOrderItems
    };
    setHeldOrders(prev => [...prev, newHold]);
    setCurrentOrderItems([]);
  };

  const handleResumeOrder = (holdId: string) => {
    const target = heldOrders.find(h => h.id === holdId);
    if (target) {
      setCurrentOrderItems(target.items);
      setSelectedTable(target.table);
      setHeldOrders(prev => prev.filter(h => h.id !== holdId));
    }
  };

  // Submit Bill
  const handleCheckoutSubmit = async () => {
    if (currentOrderItems.length === 0) return;

    if (paymentMethod === 'UPI') {
      setIsUpiModalOpen(true);
      return;
    }

    await finalizeOrderCreation();
  };

  const finalizeOrderCreation = async () => {
    setIsSubmitting(true);
    try {
      const created = await api.createOrder({
        items: currentOrderItems,
        orderType,
        tableNumber: selectedTable,
        discount: discountAmount,
        taxRate,
        paymentMethod,
        amountReceived: numReceived,
        notes: orderNotes,
        cashierName: 'Kovai POS Operator'
      });

      setGeneratedOrder(created);
      setIsReceiptOpen(true);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 }
      });

      setCurrentOrderItems([]);
      setDiscountAmount(0);
      setAmountReceived('');
      setOrderNotes('');
    } catch (err: any) {
      alert(`Order Creation Failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setIsUpiModalOpen(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const quickBillItems = menuItems.filter(i => i.quickBillKey !== null && i.quickBillKey !== undefined);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-charcoal-950 overflow-hidden text-stone-100 font-sans">
      
      {/* ZONE 1: Category Sidebar (Left) */}
      <div className="w-full lg:w-48 bg-charcoal-900 border-r border-charcoal-800 flex lg:flex-col overflow-x-auto lg:overflow-y-auto shrink-0 p-2 gap-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left shrink-0 transition-all flex items-center justify-between ${
            selectedCategory === 'ALL'
              ? 'bg-chilli-700 text-white shadow-md shadow-chilli-900/40 border border-chilli-500/30'
              : 'text-stone-300 hover:bg-charcoal-850'
          }`}
        >
          <span>ALL DISHES</span>
          <span className="text-[10px] font-mono opacity-80">{menuItems.length}</span>
        </button>

        {categories.map(cat => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left shrink-0 transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-chilli-700 text-white shadow-md shadow-chilli-900/40 border border-chilli-500/30'
                  : 'text-stone-300 hover:bg-charcoal-850'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* ZONE 2: Food Menu Cards Grid (Center) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-charcoal-800">
        
        {/* Search Header */}
        <div className="p-3 bg-charcoal-900 border-b border-charcoal-800 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search Kovai dishes (Bun Parotta, Biryani...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-950 border border-charcoal-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-turmeric-500"
            />
          </div>

          <div className="text-xs text-stone-400 font-semibold shrink-0 hidden sm:block">
            Showing <strong className="text-turmeric-400">{filteredItems.length}</strong> items
          </div>
        </div>

        {/* Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredItems.map(item => (
            <div
              key={item._id}
              className={`bg-charcoal-900 border rounded-2xl p-3 flex flex-col justify-between transition-all group ${
                !item.isAvailable
                  ? 'border-chilli-900/40 opacity-60 bg-chilli-950/10'
                  : 'border-charcoal-800 hover:border-chilli-600/50 hover:shadow-lg'
              }`}
            >
              {/* Photo & Badges */}
              <div className="relative h-32 bg-charcoal-850 rounded-xl overflow-hidden mb-2">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {item.isPopular && (
                  <span className="absolute top-1.5 left-1.5 bg-turmeric-500 text-charcoal-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow">
                    🔥 POPULAR
                  </span>
                )}

                {item.isVeg ? (
                  <span className="absolute top-1.5 right-1.5 bg-leaf-800/90 border border-leaf-500 text-leaf-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Veg
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 bg-chilli-900/90 border border-chilli-500 text-chilli-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Non-Veg
                  </span>
                )}

                {!item.isAvailable && (
                  <span className="absolute inset-0 bg-charcoal-950/80 text-chilli-400 font-extrabold text-[10px] uppercase flex items-center justify-center">
                    OUT OF STOCK
                  </span>
                )}
              </div>

              {/* Info */}
              <div>
                <h4 className="font-extrabold text-xs text-white truncate">{item.name}</h4>
                <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{item.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-turmeric-400 font-extrabold font-mono text-sm">₹{item.price}</span>
                  <span className="text-[10px] text-stone-500 uppercase">{item.category}</span>
                </div>
              </div>

              {/* ADD Button */}
              <div className="mt-2 pt-2 border-t border-charcoal-800">
                <button
                  onClick={() => addItemToOrder(item)}
                  disabled={!item.isAvailable}
                  className={`w-full py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all ${
                    item.isAvailable
                      ? 'bg-chilli-700 hover:bg-chilli-600 text-white shadow-md'
                      : 'bg-charcoal-800 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  <Plus size={14} />
                  <span>ADD TO BILL</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ZONE 3: Current Order Bill Panel (Right) */}
      <div className="w-full lg:w-[420px] bg-charcoal-900 flex flex-col h-full shrink-0">
        
        {/* Order Header */}
        <div className="p-4 bg-charcoal-850 border-b border-charcoal-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <ShoppingBag size={18} className="text-chilli-500" />
              <span>CURRENT ORDER BILL</span>
            </h3>
            {heldOrders.length > 0 && (
              <span className="text-[10px] bg-turmeric-500/20 text-turmeric-400 border border-turmeric-500/30 px-2 py-0.5 rounded-full font-bold">
                {heldOrders.length} Held
              </span>
            )}
          </div>

          {/* Dine In / Takeaway / Parcel switcher */}
          <div className="grid grid-cols-3 gap-1 bg-charcoal-950 p-1 rounded-xl border border-charcoal-800 text-xs font-bold">
            {(['Dine In', 'Takeaway', 'Parcel'] as OrderType[]).map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`py-1.5 rounded-lg transition-all ${
                  orderType === type
                    ? 'bg-chilli-700 text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Table selection */}
          {orderType === 'Dine In' && (
            <div className="flex items-center justify-between bg-charcoal-950 p-2 rounded-xl border border-charcoal-800 text-xs">
              <span className="text-stone-400 font-bold">Table Selection:</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-charcoal-900 text-turmeric-400 font-extrabold border border-charcoal-700 rounded-lg px-2 py-1 focus:outline-none"
              >
                {Array.from({ length: 20 }, (_, i) => {
                  const tNum = `Table ${String(i + 1).padStart(2, '0')}`;
                  return <option key={tNum} value={tNum}>{tNum}</option>;
                })}
              </select>
            </div>
          )}
        </div>

        {/* Order Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentOrderItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-2">
              <Utensils size={36} className="text-stone-700 stroke-[1.5]" />
              <p className="text-xs font-bold text-stone-400">Current Bill is Empty</p>
              <p className="text-[11px] text-stone-500">Click dish cards or use Quick Bill hotkeys (1-5) to add items.</p>
            </div>
          ) : (
            currentOrderItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-charcoal-950 p-3 rounded-xl border border-charcoal-800 flex items-center justify-between text-xs"
              >
                <div className="flex-1 pr-2">
                  <h5 className="font-extrabold text-white">{item.name}</h5>
                  <span className="text-[11px] text-turmeric-400 font-mono">₹{item.price} each</span>
                </div>

                <div className="flex items-center gap-1 bg-charcoal-900 rounded-lg border border-charcoal-800 p-0.5">
                  <button onClick={() => updateItemQty(idx, -1)} className="p-1 text-stone-400 hover:text-white">
                    <Minus size={12} />
                  </button>
                  <span className="px-2 font-black text-white font-mono">{item.quantity}</span>
                  <button onClick={() => updateItemQty(idx, 1)} className="p-1 text-stone-400 hover:text-white">
                    <Plus size={12} />
                  </button>
                </div>

                <div className="w-16 text-right font-black text-turmeric-400 font-mono">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button onClick={() => removeItem(idx)} className="p-1 text-stone-600 hover:text-red-400 ml-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Held Orders Quick Resume Bar */}
        {heldOrders.length > 0 && (
          <div className="px-4 py-2 bg-turmeric-500/10 border-t border-turmeric-500/20 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-turmeric-400 shrink-0">HELD:</span>
            {heldOrders.map(h => (
              <button
                key={h.id}
                onClick={() => handleResumeOrder(h.id)}
                className="bg-turmeric-500/20 hover:bg-turmeric-500/30 text-turmeric-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-turmeric-500/30 shrink-0"
              >
                {h.table} ({h.items.length} items)
              </button>
            ))}
          </div>
        )}

        {/* Math & Complete Bill Footer */}
        <div className="p-4 bg-charcoal-850 border-t border-charcoal-800 space-y-3">
          
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span className="font-mono text-stone-200">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-stone-400">
              <span>Discount (₹)</span>
              <input
                type="number"
                min="0"
                value={discountAmount || ''}
                onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="0"
                className="w-20 bg-charcoal-950 border border-charcoal-700 rounded px-2 py-0.5 text-right text-xs text-turmeric-400 font-mono focus:outline-none"
              />
            </div>

            <div className="flex justify-between text-stone-400">
              <span>GST ({taxRate}%)</span>
              <span className="font-mono text-stone-200">₹{taxVal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-black text-base text-white border-t border-charcoal-700 pt-1.5">
              <span>GRAND TOTAL</span>
              <span className="text-turmeric-400 font-mono">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-1 bg-charcoal-950 p-1 rounded-xl border border-charcoal-800 text-xs font-extrabold">
            {(['Cash', 'UPI', 'Card'] as PaymentMethod[]).map(pm => (
              <button
                key={pm}
                onClick={() => setPaymentMethod(pm)}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  paymentMethod === pm
                    ? 'bg-turmeric-500 text-charcoal-950'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {pm === 'Cash' && <Banknote size={13} />}
                {pm === 'UPI' && <QrCode size={13} />}
                {pm === 'Card' && <CreditCard size={13} />}
                <span>{pm}</span>
              </button>
            ))}
          </div>

          {/* Cash Return Calculator */}
          {paymentMethod === 'Cash' && (
            <div className="flex items-center justify-between gap-2 bg-charcoal-950 p-2 rounded-xl border border-charcoal-800 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">Cash Received (₹):</span>
                <input
                  type="number"
                  placeholder={grandTotal.toFixed(2)}
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="w-24 bg-charcoal-900 border border-charcoal-700 rounded px-2 py-1 text-xs text-leaf-400 font-bold font-mono focus:outline-none"
                />
              </div>
              <div className="text-right">
                <span className="text-stone-400 block text-[10px]">Change Due:</span>
                <span className="font-black text-turmeric-400 font-mono text-sm">
                  ₹{changeVal.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleHoldOrder}
              disabled={currentOrderItems.length === 0}
              title="Hold Order"
              className="p-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 text-stone-300 border border-charcoal-700 disabled:opacity-40"
            >
              <PauseCircle size={18} />
            </button>

            <button
              onClick={() => setCurrentOrderItems([])}
              disabled={currentOrderItems.length === 0}
              title="Clear Bill"
              className="p-2.5 rounded-xl bg-charcoal-800 hover:bg-red-500/20 text-stone-300 hover:text-red-400 border border-charcoal-700 disabled:opacity-40"
            >
              <XCircle size={18} />
            </button>

            <button
              onClick={handleCheckoutSubmit}
              disabled={currentOrderItems.length === 0 || isSubmitting}
              className="flex-1 bg-gradient-to-r from-chilli-600 to-chilli-700 hover:from-chilli-500 hover:to-chilli-600 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-chilli-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Processing...' : `COMPLETE BILL (₹${grandTotal.toFixed(2)})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickBillModal
        isOpen={isQuickBillOpen}
        onClose={() => setIsQuickBillOpen(false)}
        quickBillItems={quickBillItems}
        onAddItem={(item, qty) => addItemToOrder(item, qty)}
      />

      <UpiPaymentModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        grandTotal={grandTotal}
        orderNumber="KB-POS"
        onConfirmPayment={finalizeOrderCreation}
      />

      <ReceiptModal
        order={generatedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
