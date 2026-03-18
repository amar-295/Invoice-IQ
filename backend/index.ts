import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import intializeMongoDB from './ConnectDB';
import AuthRouter from './Router/Auth.Router';
import SellerManagementRouter from './Router/SellerManagement.Router';
import UserInterfaceRouter from './Router/UserInterface.Router';
import DeliveryRouter from './Router/Delivery.Router';
import ProductRouter from './Router/Product.Router';
import AnalyticsRouter from './Router/Analytics.Router';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 9000;
const allowedOrigins = ['http://localhost:3000', 'https://invoiceiq-two.vercel.app',];

app.use("/api",cors({
    origin: allowedOrigins,
    credentials: true,
}));


app.use(cookieParser());
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "12mb" }));

intializeMongoDB();

app.use("/api/auth", AuthRouter);
app.use("/api/sellerManagement", SellerManagementRouter);
app.use("/api/userInterface", UserInterfaceRouter);
app.use("/api/delivery", DeliveryRouter);
app.use("/api/product", ProductRouter);
app.use("/api/analytics", AnalyticsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});