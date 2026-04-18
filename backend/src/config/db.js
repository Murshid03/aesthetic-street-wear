import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/Aesthetic_db';

        try {
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                dbName: 'Aesthetic_db'
            });
            console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.log('⚠️ Local MongoDB not found, starting In-Memory MongoDB for development...');
                const mongod = await MongoMemoryServer.create();
                const memoryUri = mongod.getUri();
                const conn = await mongoose.connect(memoryUri, { dbName: 'Aesthetic_db' });
                console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

                // Set the URI in process.env so it can be reused or logged
                process.env.MONGO_URI = memoryUri;
            } else {
                throw err;
            }
        }
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};
