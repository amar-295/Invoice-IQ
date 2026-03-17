import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import intializeMongoDB from './ConnectDB';
import AuthRouter from './Router/Auth.Router';
import SellerManagementRouter from './Router/SellerManagement.Router';
import UserInterfaceRouter from './Router/UserInterface.Router';
import DeliveryRouter from './Router/Delivery.Router';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 9000;
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173',];

app.use("/api",cors({
    origin: allowedOrigins,
    credentials: true,
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

intializeMongoDB();

app.use("/api/auth", AuthRouter);
app.use("/api/sellerManagement", SellerManagementRouter);
app.use("/api/userInterface", UserInterfaceRouter);
app.use("/api/delivery", DeliveryRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});