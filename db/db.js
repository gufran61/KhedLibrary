const { MongoClient } = require('mongodb');
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URL); // Initialize the MongoClient

async function connectDb() {
    try {
        // Check if the client is already connected or needs to connect
        if (!client.topology || client.topology.isDestroyed()) {
            await client.connect(); // Connect to MongoDB
        }

        const db = client.db('excelWithNode'); // Replace 'excelWithNode' with your database name
        const collection = db.collection('formdata'); // Replace 'formdata' with your collection name
        return collection; // Return the collection object
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = {
    connectDb
};
