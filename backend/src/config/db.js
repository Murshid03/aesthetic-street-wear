import mongoose from 'mongoose';

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    const uri = process.env.MONGO_URI;

    // In production, MONGO_URI must be set as an environment variable in Vercel
    if (!uri) {
        const msg = process.env.NODE_ENV === 'production'
            ? 'MONGO_URI environment variable is not set. Please add it in your Vercel project settings under Settings → Environment Variables.'
            : 'MONGO_URI is not set. Check your .env file.';
        console.error('❌', msg);
        throw new Error(msg);
    }

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000,
            dbName: 'Aesthetic_db'
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (err) {
        // In development only, try falling back to an in-memory DB
        if (process.env.NODE_ENV !== 'production') {
            try {
                console.log('⚠️ Could not connect to MongoDB, trying in-memory fallback...');
                const { MongoMemoryServer } = await import('mongodb-memory-server');
                const mongod = await MongoMemoryServer.create();
                const memUri = mongod.getUri();
                const conn = await mongoose.connect(memUri, { dbName: 'Aesthetic_db' });
                process.env.MONGO_URI = memUri;
                console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
                return;
            } catch (memErr) {
                console.error('❌ In-memory MongoDB also failed:', memErr.message);
            }
        }
        console.error('❌ MongoDB connection failed:', err.message);
        throw err;
    }
};


