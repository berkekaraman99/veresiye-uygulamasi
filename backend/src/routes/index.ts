import express, { Router } from "express";
import ReceiptRoutes from "./receipt_routes";
import CustomerRoutes from "./customer_routes";

const RootRoutes: Router = express.Router();

RootRoutes.use("/receipt", ReceiptRoutes);
RootRoutes.use("/customer", CustomerRoutes);

export default RootRoutes;
