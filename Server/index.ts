import express from 'express';
import cors from 'cors';
import MongoDBController from './controllers/MongoDBController';
import userRoutes from './routes/userRoutes';

const app = express();
const port = process.env.PORT || 3000;
const localMongo = true // Set this environment variable to true for local MongoDB
const dbUri = process.env.MONGO_URI || ''; // Use this environment variable for the remote MongoDB URI

const mongoController = new MongoDBController(localMongo, dbUri);
app.use(cors());

app.use(express.json());
app.use('/api', userRoutes);

mongoController.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

process.on('SIGINT', async () => {
  await mongoController.disconnect();
  process.exit(0);
});