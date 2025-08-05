
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// This is a one-time setup function for the database.
async function initDb() {
  try {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    await db.exec('PRAGMA foreign_keys = ON;');

    // Create tables if they don't exist
    await Promise.all([
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `),
      db.exec(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          brand TEXT NOT NULL,
          originalPrice REAL NOT NULL,
          offerPrice REAL NOT NULL,
          description TEXT NOT NULL,
          images TEXT NOT NULL, -- Storing as JSON array string
          isFeatured BOOLEAN NOT NULL,
          quality TEXT NOT NULL,
          category TEXT NOT NULL,
          createdAt DATETIME NOT NULL
        )
      `),
      db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY CHECK (id = 1), -- Enforce only one row
          heroImage TEXT,
          whatsappNumber TEXT
        )
      `)
    ]);

    // Seed initial data only if tables are empty
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count === 0) {
      // In a real app, passwords MUST be hashed and salted!
      await db.run('INSERT INTO users (email, password) VALUES (?, ?)', 'busi@rafiadi2', 'rafiadil@11busi');
      console.log('Default user created.');
    }

    const productCount = await db.get('SELECT COUNT(*) as count FROM products');
    if (productCount.count === 0) {
      const initialProducts = [
        { id: "1", name: "Air Jordan 1 Retro High", brand: "Jordan", originalPrice: 18007, offerPrice: 15999, description: "A timeless classic.", images: ["https://picsum.photos/id/10/800/800"], isFeatured: true, quality: "10A", category: "Basketball" },
        { id: "2", name: "Yeezy Boost 350", brand: "Yeezy", originalPrice: 22000, offerPrice: 19999, description: "The 'Zebra' colorway.", images: ["https://picsum.photos/id/20/800/800"], isFeatured: true, quality: "10A", category: "Lifestyle" },
        { id: "3", name: "Nike Dunk Low", brand: "Nike", originalPrice: 11000, offerPrice: 8999, description: "The Nike Dunk Low 'Panda'.", images: ["https://picsum.photos/id/30/800/800"], isFeatured: true, quality: "9A", category: "Skateboarding" },
      ];
      const stmt = await db.prepare('INSERT INTO products (id, name, brand, originalPrice, offerPrice, description, images, isFeatured, quality, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      for (const p of initialProducts) {
        await stmt.run(p.id, p.name, p.brand, p.originalPrice, p.offerPrice, p.description, JSON.stringify(p.images), p.isFeatured, p.quality, p.category, new Date().toISOString());
      }
      await stmt.finalize();
      console.log('Initial products seeded.');
    }
    
    const settingsCount = await db.get('SELECT COUNT(*) as count FROM settings');
    if (settingsCount.count === 0) {
        await db.run('INSERT INTO settings (id, heroImage, whatsappNumber) VALUES (?, ?, ?)', 1, 'https://picsum.photos/id/101/1200/600', '911234567890');
        console.log('Initial settings seeded.');
    }


    console.log('Database initialized successfully.');
    return db;
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1); // Exit if DB fails to initialize
  }
}

module.exports = { initDb };
