const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { initDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-super-secret-key-that-should-be-in-an-env-file';

let db;

// --- GLOBAL MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // for base64 images

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}


// --- AUTH MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// --- API ROUTES ---
const apiRouter = express.Router();

// AUTH ROUTES
apiRouter.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // IMPORTANT: In a real app, passwords MUST be hashed. This is for demonstration only.
        const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', email, password);
        if (user) {
            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


// SETTINGS ROUTES
apiRouter.get('/settings', async (req, res) => {
    try {
        const settings = await db.get('SELECT * FROM settings WHERE id = 1');
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get settings' });
    }
});

apiRouter.put('/settings', authMiddleware, async (req, res) => {
    const { heroImage, whatsappNumber } = req.body;
    try {
        if (heroImage) {
            await db.run('UPDATE settings SET heroImage = ? WHERE id = 1', heroImage);
        }
        if (whatsappNumber) {
            await db.run('UPDATE settings SET whatsappNumber = ? WHERE id = 1', whatsappNumber);
        }
        const updatedSettings = await db.get('SELECT * FROM settings WHERE id = 1');
        res.json(updatedSettings);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Failed to update settings' });
    }
});

// PRODUCT ROUTES
apiRouter.get('/products', async (req, res) => {
    try {
        const products = await db.all('SELECT * FROM products ORDER BY createdAt DESC');
        // Parse the images string back into an array
        products.forEach(p => { p.images = JSON.parse(p.images) });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get products' });
    }
});

apiRouter.post('/products', authMiddleware, async (req, res) => {
    const { name, brand, originalPrice, offerPrice, description, images, isFeatured, quality, category } = req.body;
    const newProduct = { 
        id: uuidv4(),
        name, brand, originalPrice, offerPrice, description,
        images: JSON.stringify(images), // Store images array as a JSON string
        isFeatured, quality, category,
        createdAt: new Date().toISOString()
    };
    try {
        await db.run(
            `INSERT INTO products (id, name, brand, originalPrice, offerPrice, description, images, isFeatured, quality, category, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(newProduct)
        );
        res.status(201).json({ ...newProduct, images: JSON.parse(newProduct.images) });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Failed to create product' });
    }
});

apiRouter.put('/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, brand, originalPrice, offerPrice, description, images, isFeatured, quality, category } = req.body;
    try {
        await db.run(
            `UPDATE products SET name = ?, brand = ?, originalPrice = ?, offerPrice = ?, description = ?, images = ?, isFeatured = ?, quality = ?, category = ? WHERE id = ?`,
            name, brand, originalPrice, offerPrice, description, JSON.stringify(images), isFeatured, quality, category, id
        );
        const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', id);
        if (updatedProduct) {
            updatedProduct.images = JSON.parse(updatedProduct.images);
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
});

apiRouter.delete('/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.run('DELETE FROM products WHERE id = ?', id);
        if (result.changes > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

// IMAGE UPLOAD ROUTE
apiRouter.post('/upload', authMiddleware, (req, res) => {
    try {
        const { image } = req.body;
        if (!image || !image.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image data' });
        }
        
        // Decode base64 string
        const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches.length !== 3) {
            return res.status(400).json({ message: 'Invalid image format' });
        }
        
        const imageType = matches[1].replace('jpeg', 'jpg');
        const imageBuffer = Buffer.from(matches[2], 'base64');
        const filename = `${uuidv4()}.${imageType}`;
        const filepath = path.join(uploadsDir, filename);

        fs.writeFileSync(filepath, imageBuffer);

        // Return the public URL
        const publicUrl = `/uploads/${filename}`;
        res.json({ url: publicUrl });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

// Mount the API router
app.use('/api', apiRouter);

// --- START SERVER ---
async function startServer() {
    db = await initDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
