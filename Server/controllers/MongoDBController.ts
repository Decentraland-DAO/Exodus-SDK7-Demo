// src/controllers/MongoDBController.ts
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

class MongoDBController {
  private connectionString: string;
  private mongoMemoryServer?: MongoMemoryServer;

  constructor(local: boolean, dbUri: string) {
    this.connectionString = local ? 'mongodb://localhost:27017/mydatabase' : dbUri;
  }

  public async connect() {
    try {
      if (this.connectionString === 'mongodb://localhost:27017/mydatabase') {
        // Using MongoMemoryServer for local testing
        this.mongoMemoryServer = await MongoMemoryServer.create();
        this.connectionString = this.mongoMemoryServer.getUri();
      }

      await mongoose.connect(this.connectionString, {
        dbName: "GameDB"
      });
      console.log('MongoDB connected to:', this.connectionString);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  public async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('MongoDB disconnected');
      
      if (this.mongoMemoryServer) {
        await this.mongoMemoryServer.stop();
        console.log('In-memory MongoDB stopped');
      }
    } catch (error) {
      console.error('MongoDB disconnection error:', error);
    }
  }
}

export default MongoDBController;