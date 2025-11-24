import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dummy products data from frontend (migrated)
const dummyProducts = [
  // Groceries
  { id: 'gro-1', name: 'Rice 5kg', price: 12.99, stock: 25, lowStockThreshold: 5, category: 'Groceries', image: '/Images/groceries1.jpg', description: 'High-quality long-grain rice' },
  { id: 'gro-2', name: 'All-purpose Flour 2kg', price: 3.49, stock: 30, lowStockThreshold: 5, category: 'Groceries', image: '/Images/groceries2.jpg', description: 'Enriched wheat flour' },
  { id: 'gro-3', name: 'Olive Oil 1L', price: 6.99, stock: 15, lowStockThreshold: 5, category: 'Groceries', image: '/Images/groceries3.jpg', description: 'Extra virgin olive oil' },
  { id: 'gro-4', name: 'Sugar 2kg', price: 2.49, stock: 40, lowStockThreshold: 5, category: 'Groceries', image: '/Images/groceries4.jpg', description: 'Refined white sugar' },
  { id: 'gro-5', name: 'Pasta 500g', price: 1.99, stock: 50, lowStockThreshold: 5, category: 'Groceries', image: '/Images/groceries5.jpg', description: 'Durum wheat pasta' },
  { id: 'gro-6', name: 'Canned Beans 400g', price: 1.29, stock: 35, lowStockThreshold: 5, category: 'Groceries', image: '/Images/groceries6.jpg', description: 'Ready-to-eat cannellini beans' },

  // Household
  { id: 'hh-1', name: 'Laundry Detergent 2L', price: 8.99, stock: 20, lowStockThreshold: 5, category: 'Household', image: '/Images/groceries7.jpg', description: 'Liquid detergent for colors' },
  { id: 'hh-2', name: 'Dishwashing Liquid 500ml', price: 2.99, stock: 25, lowStockThreshold: 5, category: 'Household', image: '/Images/groceries8.jpg', description: 'Tough grease remover' },
  { id: 'hh-3', name: 'Toilet Paper (12 roll)', price: 4.99, stock: 18, lowStockThreshold: 5, category: 'Household', image: '/Images/groceries9.jpg', description: 'Soft and absorbent' },
  { id: 'hh-4', name: 'All-purpose Cleaner 750ml', price: 3.49, stock: 22, lowStockThreshold: 5, category: 'Household', image: '/Images/groceries10.jpg', description: 'Multi-surface cleaner' },
  { id: 'hh-5', name: 'Garbage Bags (50)', price: 2.79, stock: 30, lowStockThreshold: 5, category: 'Household', image: '/Images/groceries11.jpg', description: 'Strong and tear-resistant' },
  { id: 'hh-6', name: 'Light Bulb LED', price: 3.29, stock: 40, lowStockThreshold: 5, category: 'Household', image: '/Images/groceries12.jpg', description: '9W LED bulb' },

  // Snacks
  { id: 'snack-1', name: 'Potato Chips 150g', price: 1.99, stock: 45, lowStockThreshold: 5, category: 'Snacks', image: '/Images/groceries19.jpg', description: 'Crispy salted potato chips' },
  { id: 'snack-2', name: 'Chocolate Bar', price: 0.99, stock: 60, lowStockThreshold: 10, category: 'Snacks', image: '/Images/groceries20.jpg', description: 'Milk chocolate bar' },
  { id: 'snack-3', name: 'Trail Mix 200g', price: 3.49, stock: 25, lowStockThreshold: 5, category: 'Snacks', image: '/Images/groceries21.jpg', description: 'Nuts and dried fruit mix' },
  { id: 'snack-4', name: 'Biscuits Pack', price: 1.49, stock: 50, lowStockThreshold: 10, category: 'Snacks', image: '/Images/groceries22.jpg', description: 'Assorted tea biscuits' },
  { id: 'snack-5', name: 'Instant Noodles', price: 0.79, stock: 70, lowStockThreshold: 10, category: 'Snacks', image: '/Images/groceries23.jpg', description: 'Quick and tasty noodle cups' },
  { id: 'snack-6', name: 'Cookies Pack', price: 2.29, stock: 40, lowStockThreshold: 5, category: 'Snacks', image: '/Images/groceries24.jpg', description: 'Chocolate chip cookies' },

  // Beverages
  { id: 'bev-1', name: 'Bottled Water 1.5L', price: 0.99, stock: 100, lowStockThreshold: 20, category: 'Beverages', image: '/Images/groceries13.jpg', description: 'Pure spring water' },
  { id: 'bev-2', name: 'Orange Juice 1L', price: 2.99, stock: 35, lowStockThreshold: 5, category: 'Beverages', image: '/Images/groceries14.jpg', description: '100% squeezed orange juice' },
  { id: 'bev-3', name: 'Soda Can', price: 0.89, stock: 80, lowStockThreshold: 15, category: 'Beverages', image: '/Images/groceries15.jpg', description: 'Carbonated soft drink' },
  { id: 'bev-4', name: 'Energy Drink 330ml', price: 1.79, stock: 45, lowStockThreshold: 10, category: 'Beverages', image: '/Images/groceries16.jpg', description: 'Boost your energy' },
  { id: 'bev-5', name: 'Coffee Jar 200g', price: 5.99, stock: 20, lowStockThreshold: 5, category: 'Beverages', image: '/Images/groceries17.jpg', description: 'Ground coffee' },
  { id: 'bev-6', name: 'Tea Bags (50)', price: 3.49, stock: 30, lowStockThreshold: 5, category: 'Beverages', image: '/Images/groceries18.jpg', description: 'Black tea bags' },

  // Medicines - OTC
  { id: 'med-otc-1', name: 'Paracetamol 500mg (20)', price: 2.99, stock: 100, lowStockThreshold: 20, category: 'OTC Medicines', image: '/Images/medicine1.jpg', description: 'Pain reliever and fever reducer' },
  { id: 'med-otc-2', name: 'Ibuprofen 200mg (20)', price: 3.49, stock: 80, lowStockThreshold: 15, category: 'OTC Medicines', image: '/Images/medicine2.jpg', description: 'Anti-inflammatory pain relief' },
  { id: 'med-otc-3', name: 'Antacid Chewable (30)', price: 4.25, stock: 60, lowStockThreshold: 10, category: 'OTC Medicines', image: '/Images/medicine3.jpg', description: 'Relieves heartburn and indigestion' },
  { id: 'med-otc-4', name: 'Cough Syrup 100ml', price: 5.99, stock: 40, lowStockThreshold: 10, category: 'OTC Medicines', image: '/Images/medicine4.jpg', description: 'Soothes cough and throat irritation' },
  { id: 'med-otc-5', name: 'Antihistamine 10mg (10)', price: 3.79, stock: 50, lowStockThreshold: 10, category: 'OTC Medicines', image: '/Images/medicine5.jpg', description: 'Allergy relief tablets' },

  // Supplements
  { id: 'med-sup-1', name: 'Multivitamin (30)', price: 6.99, stock: 45, lowStockThreshold: 10, category: 'Supplements', image: '/Images/medicine6.jpg', description: 'Daily vitamins and minerals' },
  { id: 'med-sup-2', name: 'Vitamin D3 1000IU (60)', price: 5.49, stock: 35, lowStockThreshold: 10, category: 'Supplements', image: '/Images/medicine7.jpg', description: 'Bone and immune support' },
  { id: 'med-sup-3', name: 'Omega-3 (60)', price: 8.99, stock: 30, lowStockThreshold: 5, category: 'Supplements', image: '/Images/medicine8.jpg', description: 'Heart and brain health' },
  { id: 'med-sup-4', name: 'Protein Powder 500g', price: 14.99, stock: 20, lowStockThreshold: 5, category: 'Supplements', image: '/Images/medicine9.jpg', description: 'Muscle recovery protein' },
  { id: 'med-sup-5', name: 'Probiotic (30)', price: 9.49, stock: 25, lowStockThreshold: 5, category: 'Supplements', image: '/Images/medicine10.jpg', description: 'Supports gut health' },

  // First Aid
  { id: 'med-first-1', name: 'Basic First Aid Kit', price: 19.99, stock: 15, lowStockThreshold: 3, category: 'First Aid', image: '/Images/medicine11.jpg', description: 'Bandages, antiseptic wipes, and tools' },
  { id: 'med-first-2', name: 'Burn Relief Gel 50g', price: 6.0, stock: 30, lowStockThreshold: 5, category: 'First Aid', image: '/Images/medicine12.jpg', description: 'Soothes minor burns' },
  { id: 'med-first-3', name: 'Antiseptic Spray 100ml', price: 4.99, stock: 40, lowStockThreshold: 10, category: 'First Aid', image: '/Images/medicine13.jpg', description: 'Cleans and protects wounds' },
  { id: 'med-first-4', name: 'Sterile Gauze Pack', price: 3.49, stock: 50, lowStockThreshold: 10, category: 'First Aid', image: '/Images/medicine14.jpg', description: 'Wound dressing' },
  { id: 'med-first-5', name: 'Adhesive Tape', price: 1.99, stock: 60, lowStockThreshold: 15, category: 'First Aid', image: '/Images/medicine15.jpg', description: 'Secure dressings and bandages' },
  { id: 'med-first-6', name: 'Digital Thermometer', price: 9.99, stock: 25, lowStockThreshold: 5, category: 'First Aid', image: '/Images/medicine16.jpg', description: 'Fast temperature readings' },

  // Personal Care
  { id: 'med-pc-1', name: 'Hand Sanitizer 250ml', price: 3.99, stock: 70, lowStockThreshold: 15, category: 'Personal Care', image: '/Images/medicine17.jpg', description: 'Kills germs and moisturizes' },
  { id: 'med-pc-2', name: 'Disposable Masks (10)', price: 5.49, stock: 100, lowStockThreshold: 20, category: 'Personal Care', image: '/Images/medicine18.jpg', description: 'Comfortable 3-ply masks' },
  { id: 'med-pc-3', name: 'Moisturizing Cream 100g', price: 6.99, stock: 35, lowStockThreshold: 10, category: 'Personal Care', image: '/Images/medicine19.jpg', description: 'Hydrates and soothes skin' },
  { id: 'med-pc-4', name: 'Pain Relief Patch (5)', price: 4.49, stock: 40, lowStockThreshold: 10, category: 'Personal Care', image: '/Images/medicine20.jpg', description: 'Topical muscle pain relief' },
  { id: 'med-pc-5', name: 'Fluoride Toothpaste 100g', price: 2.29, stock: 80, lowStockThreshold: 20, category: 'Personal Care', image: '/Images/medicine21.jpg', description: 'Daily cavity protection' },
  { id: 'med-pc-6', name: 'Scented Body Wash 500ml', price: 7.99, stock: 30, lowStockThreshold: 10, category: 'Personal Care', image: '/Images/medicine22.jpg', description: 'Refreshing and cleansing' },

  // Vegetables
  { id: 'veg-1', name: 'Organic Tomatoes', price: 3.99, stock: 50, lowStockThreshold: 10, category: 'Fresh Vegetables', image: '/Images/vegetable1.jpg', description: 'Ripe, juicy organic tomatoes perfect for salads and cooking' },
  { id: 'veg-2', name: 'Fresh Spinach Bundle', price: 2.49, stock: 30, lowStockThreshold: 5, category: 'Fresh Vegetables', image: '/Images/vegetable2.jpg', description: 'Crisp, nutrient-rich spinach leaves' },
  { id: 'veg-3', name: 'Crispy Cucumbers', price: 1.99, stock: 40, lowStockThreshold: 10, category: 'Fresh Vegetables', image: '/Images/vegetable3.jpg', description: 'Cool and refreshing cucumbers' },
  { id: 'veg-4', name: 'Bell Peppers Mix', price: 4.49, stock: 25, lowStockThreshold: 5, category: 'Fresh Vegetables', image: '/Images/vegetable4.jpg', description: 'Assorted bell peppers in red, yellow, and green' },
  { id: 'veg-5', name: 'Carrots Bundle', price: 2.99, stock: 45, lowStockThreshold: 10, category: 'Fresh Vegetables', image: '/Images/vegetable5.jpg', description: 'Fresh, orange carrots packed with vitamins' },
  { id: 'veg-6', name: 'Broccoli Florets', price: 3.49, stock: 20, lowStockThreshold: 5, category: 'Fresh Vegetables', image: '/Images/vegetable6.jpg', description: 'Fresh broccoli crowns' },

  // Fruits
  { id: 'fruit-1', name: 'Apples (1kg)', price: 4.99, stock: 60, lowStockThreshold: 15, category: 'Fruits', image: '/Images/vegetable7.jpg', description: 'Crisp, sweet apples sourced from local orchards' },
  { id: 'fruit-2', name: 'Bananas Bundle', price: 2.99, stock: 80, lowStockThreshold: 20, category: 'Fruits', image: '/Images/vegetable8.jpg', description: 'Golden ripe bananas' },
  { id: 'fruit-3', name: 'Fresh Oranges', price: 5.99, stock: 40, lowStockThreshold: 10, category: 'Fruits', image: '/Images/vegetable9.jpg', description: 'Juicy, sweet oranges perfect for fresh juice' },

  // Herbs & Spices
  { id: 'herbs-1', name: 'Fresh Basil', price: 1.99, stock: 25, lowStockThreshold: 5, category: 'Herbs & Spices', image: '/Images/vegetable10.jpg', description: 'Aromatic fresh basil' },
  { id: 'herbs-2', name: 'Cilantro Bundle', price: 1.49, stock: 30, lowStockThreshold: 5, category: 'Herbs & Spices', image: '/Images/vegetable11.jpg', description: 'Fresh cilantro adds zest' },
  { id: 'herbs-3', name: 'Ginger Root', price: 2.79, stock: 35, lowStockThreshold: 5, category: 'Herbs & Spices', image: '/Images/vegetable12.jpg', description: 'Spicy ginger root' },

  // Organic Products
  { id: 'org-1', name: 'Organic Lettuce', price: 3.49, stock: 20, lowStockThreshold: 5, category: 'Organic Products', image: '/Images/vegetable13.jpg', description: 'Certified organic leafy lettuce' },
  { id: 'org-2', name: 'Organic Kale', price: 4.99, stock: 15, lowStockThreshold: 5, category: 'Organic Products', image: '/Images/vegetable14.jpg', description: 'Nutrient-packed organic kale' },
  { id: 'org-3', name: 'Organic Avocados', price: 6.99, stock: 25, lowStockThreshold: 5, category: 'Organic Products', image: '/Images/vegetable15.jpg', description: 'Creamy organic avocados' },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing products (optional - comment out if you want to keep existing)
  // await prisma.product.deleteMany({});
  // console.log('🗑️  Cleared existing products');

  // Create products
  for (const product of dummyProducts) {
    try {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          image: product.image,
          category: product.category,
          price: product.price,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
        },
      });
      console.log(`✅ Created: ${product.name}`);
    } catch (error) {
      // Skip if product already exists
      if (error.code === 'P2002') {
        console.log(`⏭️  Skipped (exists): ${product.name}`);
      } else {
        console.error(`❌ Error creating ${product.name}:`, error.message);
      }
    }
  }

  console.log('✨ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

