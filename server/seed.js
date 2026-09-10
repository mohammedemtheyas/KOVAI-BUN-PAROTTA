import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Category } from './models/Category.js';
import { MenuItem } from './models/MenuItem.js';
import { Order } from './models/Order.js';
import { DailyClosing } from './models/DailyClosing.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://imamsyed20077_db_user:kuIKoMEJztZTDOUq@kovai.wrbxnkp.mongodb.net/?appName=kovai';

const categories = [
  { name: 'Popular', slug: 'popular', icon: 'Flame', sortOrder: 1 },
  { name: 'Parotta', slug: 'parotta', icon: 'Disc', sortOrder: 2 },
  { name: 'Chicken', slug: 'chicken', icon: 'Drumstick', sortOrder: 3 },
  { name: 'Biryani', slug: 'biryani', icon: 'Bowl', sortOrder: 4 },
  { name: 'Rice & Noodles', slug: 'rice-noodles', icon: 'Utensils', sortOrder: 5 },
  { name: 'Egg', slug: 'egg', icon: 'Egg', sortOrder: 6 },
  { name: 'Dosa / Tiffin', slug: 'dosa', icon: 'CookingPot', sortOrder: 7 },
  { name: 'Veg', slug: 'veg', icon: 'Leaf', sortOrder: 8 },
  { name: 'Beverages', slug: 'beverages', icon: 'Coffee', sortOrder: 9 },
];

const menuItemsData = [
  {
    name: 'Bun Parotta',
    tamilName: 'பன் பரோட்டா',
    category: 'Parotta',
    price: 35,
    description: 'Soft, fluffy and multi-layered Tamil Nadu style bun parotta served with spicy chicken salna.',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: true,
    rating: 4.9,
    preparationTime: '5-10 mins',
    tags: ['Must Try', 'Signature', 'Chef Special'],
    quickBillKey: 1,
    orderCount: 480
  },
  {
    name: 'Nool Parotta',
    tamilName: 'நூல் பரோட்டா',
    category: 'Parotta',
    price: 40,
    description: 'Thread-like layered parotta crafted to crispy perfection, soft and flaky inside.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: false,
    rating: 4.8,
    preparationTime: '8-12 mins',
    tags: ['Crispy', 'Popular'],
    quickBillKey: null,
    orderCount: 310
  },
  {
    name: 'Elai Parotta',
    tamilName: 'இலை பரோட்டா',
    category: 'Parotta',
    price: 130,
    description: 'Bun parotta smothered in thick chicken chukka gravy, wrapped in fresh banana leaf and slow steamed.',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: true,
    rating: 5.0,
    preparationTime: '12-15 mins',
    tags: ['Banana Leaf', 'Signature'],
    quickBillKey: null,
    orderCount: 290
  },
  {
    name: 'Chicken Kothu Parotta',
    tamilName: 'சிக்கன் கொத்து பரோட்டா',
    category: 'Parotta',
    price: 120,
    description: 'Shredded bun parotta tossed on hot iron tawa with spiced chicken pieces, scrambled eggs, and curry leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: false,
    rating: 4.9,
    preparationTime: '10-15 mins',
    tags: ['Spicy', 'Street Style'],
    quickBillKey: null,
    orderCount: 415
  },
  {
    name: 'Chicken Biryani',
    tamilName: 'சிக்கன் பிரியாணி',
    category: 'Biryani',
    price: 150,
    description: 'Aromatic Seeraga Samba rice cooked with tender chicken pieces, ghee, and authentic Kovai spices.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: true,
    rating: 4.9,
    preparationTime: '5 mins',
    tags: ['Best Seller', 'Seeraga Samba'],
    quickBillKey: 2,
    orderCount: 520
  },
  {
    name: 'Chilli Chicken Biryani',
    tamilName: 'சில்லி சிக்கன் பிரியாணி',
    category: 'Biryani',
    price: 170,
    description: 'Special biryani topped with crispy deep fried boneless chilli chicken 65 pieces.',
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: false,
    rating: 4.8,
    preparationTime: '8 mins',
    tags: ['Spicy Combo'],
    quickBillKey: null,
    orderCount: 260
  },
  {
    name: 'Pepper Chicken Gravy',
    tamilName: 'பெப்பர் சிக்கன் கிரேவி',
    category: 'Chicken',
    price: 180,
    description: 'Tender chicken braised in freshly ground black pepper, small shallots, and curry leaves gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: true,
    rating: 4.9,
    preparationTime: '12-15 mins',
    tags: ['Pepper Hot', 'Classic'],
    quickBillKey: 5,
    orderCount: 380
  },
  {
    name: 'Chinthamani Chicken Gravy',
    tamilName: 'சிந்தாமணி சிக்கன்',
    category: 'Chicken',
    price: 190,
    description: 'Kongu style chicken cooked with whole dry red chillies, garlic cloves, and gingelly oil.',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: true,
    rating: 5.0,
    preparationTime: '15 mins',
    tags: ['Kongu Special', 'Spicy'],
    quickBillKey: null,
    orderCount: 340
  },
  {
    name: 'Hyderabad Chicken Gravy',
    tamilName: 'ஹைதராபாத் சிக்கன்',
    category: 'Chicken',
    price: 185,
    description: 'Rich creamy cashew gravy cooked with marinated fried chicken and green chillies.',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: false,
    isSpecial: false,
    rating: 4.7,
    preparationTime: '12 mins',
    tags: ['Rich Curry'],
    quickBillKey: null,
    orderCount: 190
  },
  {
    name: 'Kaadai Gravy (Quail Fry)',
    tamilName: 'காடை கிரேவி',
    category: 'Chicken',
    price: 195,
    description: 'Fresh country farm kaadai pan roasted in thick shallots and black pepper masala.',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: false,
    isSpecial: true,
    rating: 4.8,
    preparationTime: '15 mins',
    tags: ['Specialty Roast'],
    quickBillKey: null,
    orderCount: 145
  },
  {
    name: 'Chicken 65',
    tamilName: 'சிக்கன் 65',
    category: 'Chicken',
    price: 150,
    description: 'Crispy deep fried boneless chicken marinated in red chilli paste, ginger-garlic, and curry leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: false,
    rating: 4.9,
    preparationTime: '8-10 mins',
    tags: ['Starter', 'Favorite'],
    quickBillKey: null,
    orderCount: 460
  },
  {
    name: 'Chicken Rice',
    tamilName: 'சிக்கன் ரைஸ்',
    category: 'Rice & Noodles',
    price: 120,
    description: 'Wok-tossed Indo-Chinese rice with marinated chicken bits, scrambled eggs, and spring onion.',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: false,
    rating: 4.7,
    preparationTime: '10 mins',
    tags: ['Fast Food'],
    quickBillKey: 3,
    orderCount: 390
  },
  {
    name: 'Egg Rice',
    tamilName: 'முட்டை ரைஸ்',
    category: 'Rice & Noodles',
    price: 95,
    description: 'Wok-fried rice blended with fluffy eggs, white pepper, and coriander leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: false,
    rating: 4.6,
    preparationTime: '8 mins',
    tags: ['Fast Food'],
    quickBillKey: 4,
    orderCount: 350
  },
  {
    name: 'Chicken Noodles',
    tamilName: 'சிக்கன் நூடுல்ஸ்',
    category: 'Rice & Noodles',
    price: 120,
    description: 'Stir-fried noodles with chicken strips, cabbage, capsicum, and soy sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: false,
    isSpecial: false,
    rating: 4.7,
    preparationTime: '10 mins',
    tags: ['Fast Food'],
    quickBillKey: null,
    orderCount: 280
  },
  {
    name: 'Egg Noodles',
    tamilName: 'முட்டை நூடுல்ஸ்',
    category: 'Rice & Noodles',
    price: 95,
    description: 'Wok tossed noodles with egg scramble and white pepper seasonings.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: false,
    isSpecial: false,
    rating: 4.5,
    preparationTime: '8 mins',
    tags: ['Fast Food'],
    quickBillKey: null,
    orderCount: 220
  },
  {
    name: 'Ghee Roast Dosa',
    tamilName: 'நெய் ரோஸ்ட் தோசை',
    category: 'Dosa / Tiffin',
    price: 85,
    description: 'Golden paper crispy crepe roasted in pure desi ghee, served with coconut & kara chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isSpecial: false,
    rating: 4.9,
    preparationTime: '8 mins',
    tags: ['Pure Veg', 'Ghee Flavor'],
    quickBillKey: null,
    orderCount: 310
  },
  {
    name: 'Kal Dosa (2 Pcs)',
    tamilName: 'கல் தோசை',
    category: 'Dosa / Tiffin',
    price: 50,
    description: 'Soft sponge dosas cooked on cast iron griddle, paired with coconut chutney & spicy sambar.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isSpecial: false,
    rating: 4.6,
    preparationTime: '6 mins',
    tags: ['Soft Dosa'],
    quickBillKey: null,
    orderCount: 210
  },
  {
    name: 'Egg Dosa',
    tamilName: 'முட்டை தோசை',
    category: 'Dosa / Tiffin',
    price: 75,
    description: 'Crispy dosa spread with beaten egg, white pepper, and coriander sprinkle.',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isSpecial: false,
    rating: 4.8,
    preparationTime: '8 mins',
    tags: ['Egg Special'],
    quickBillKey: null,
    orderCount: 270
  },
  {
    name: 'Gobi Manchurian',
    tamilName: 'கோபி மஞ்சூரியன்',
    category: 'Veg',
    price: 110,
    description: 'Crispy fried cauliflower florets tossed in garlic chilli soy Manchurian sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isSpecial: false,
    rating: 4.6,
    preparationTime: '10 mins',
    tags: ['Veg Starter'],
    quickBillKey: null,
    orderCount: 160
  },
  {
    name: 'Madurai Jigarthanda',
    tamilName: 'மதுரை ஜிகர்தண்டா',
    category: 'Beverages',
    price: 65,
    description: 'Traditional cooling dessert drink crafted with almond gum (badam pisin), nannari syrup, and cream ice cream.',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isSpecial: true,
    rating: 5.0,
    preparationTime: '3 mins',
    tags: ['Famous Cooling Drink'],
    quickBillKey: null,
    orderCount: 380
  },
  {
    name: 'Chilled Rose Milk',
    tamilName: 'ரோஸ் மில்க்',
    category: 'Beverages',
    price: 40,
    description: 'Aromatic natural rose syrup blended with chilled sweetened milk and basil seeds.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isSpecial: false,
    rating: 4.7,
    preparationTime: '2 mins',
    tags: ['Refreshing'],
    quickBillKey: null,
    orderCount: 190
  }
];

// Helper to generate 100 realistic dummy bills across 30 days
const generateHistoricalBills = (createdMenuItems) => {
  const bills = [];
  const now = new Date();
  const paymentMethods = ['Cash', 'UPI', 'Card', 'UPI', 'Cash'];
  const orderTypes = ['Dine In', 'Dine In', 'Takeaway', 'Parcel', 'Dine In'];
  const tableNumbers = Array.from({ length: 20 }, (_, i) => `Table ${String(i + 1).padStart(2, '0')}`);

  for (let i = 1; i <= 100; i++) {
    const billNum = `KB-${1000 + i}`;
    
    // Spread dates across the last 30 days
    const daysAgo = Math.floor((100 - i) * 0.3); // approx 0 to 30 days
    const date = new Date(now.getTime() - daysAgo * 24 * 3600 * 1000);
    
    // Randomize time of day between 11:00 AM and 10:30 PM
    const hour = Math.floor(Math.random() * 11) + 11;
    const min = Math.floor(Math.random() * 60);
    date.setHours(hour, min, 0, 0);

    // Pick 2 to 5 items randomly
    const itemCount = Math.floor(Math.random() * 3) + 2;
    const selectedItems = [];
    let subtotal = 0;

    for (let k = 0; k < itemCount; k++) {
      const randomItem = createdMenuItems[Math.floor(Math.random() * createdMenuItems.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      subtotal += randomItem.price * qty;
      selectedItems.push({
        menuItemId: randomItem._id,
        name: randomItem.name,
        price: randomItem.price,
        quantity: qty,
        notes: Math.random() > 0.8 ? 'Extra salna' : ''
      });
    }

    const discount = Math.random() > 0.7 ? 10 * Math.floor(Math.random() * 3 + 1) : 0;
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.05 * 100) / 100;
    const grandTotal = Math.round((taxable + tax) * 100) / 100;

    const pm = paymentMethods[i % paymentMethods.length];
    const ot = orderTypes[i % orderTypes.length];
    const table = ot === 'Dine In' ? tableNumbers[i % tableNumbers.length] : 'N/A';

    bills.push({
      orderNumber: billNum,
      orderType: ot,
      tableNumber: table,
      items: selectedItems,
      subtotal,
      discount,
      tax,
      taxRate: 5,
      grandTotal,
      paymentMethod: pm,
      amountReceived: pm === 'Cash' ? Math.ceil(grandTotal / 50) * 50 : grandTotal,
      change: pm === 'Cash' ? Math.max(0, (Math.ceil(grandTotal / 50) * 50) - grandTotal) : 0,
      paymentStatus: 'Paid',
      status: i > 95 ? (i === 100 ? 'NEW' : 'PREPARING') : 'COMPLETED',
      cashierName: 'Kovai POS Operator',
      createdAt: date,
      updatedAt: date
    });
  }

  return bills;
};

export const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Database connected.');

    // Clear existing records
    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await DailyClosing.deleteMany({});

    // Seed Single Admin User (admin / demo123)
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const adminUser = await User.create({
      name: 'Kovai Restaurant Manager',
      username: 'admin',
      password: hashedPassword
    });
    console.log('[Seed] Single admin user created (admin / demo123).');

    // Seed Categories
    const createdCategories = await Category.create(categories);
    console.log(`[Seed] Created ${createdCategories.length} categories.`);

    // Seed Menu Items
    const createdMenuItems = await MenuItem.create(menuItemsData);
    console.log(`[Seed] Created ${createdMenuItems.length} authentic Kovai menu items.`);

    // Seed 100 Historical Bills
    const historicalBills = generateHistoricalBills(createdMenuItems);
    const createdOrders = await Order.create(historicalBills);
    console.log(`[Seed] Created ${createdOrders.length} historical bills spanning 30 days.`);

    console.log('[Seed] Master database seeding completed cleanly!');
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

if (process.argv[1].includes('seed.js')) {
  seedDatabase().then(() => process.exit(0));
}
