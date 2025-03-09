import express from 'express';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import cors from 'cors';
import { connectDb, seed } from './config/database.js';
import dotenv from 'dotenv'
import apiRoutes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();
dotenv.config();

const connect = async() => {
  await connectDb();
  await seed();
}
connect()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDNAIRY_NAME,
  api_key: process.env.CLOUDNAIRY_API_KEY,
  api_secret: process.env.CLOUDNAIRY_SECRET_KEY,
  secure: true
})

app.use(cors());

app.use(express.json())
app.use(cookieParser());

app.get('/', (req, res) => res.json("Api runing"))
app.use('/api/', apiRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, ()=>console.log(`running at port: ${process.env.PORT}`))