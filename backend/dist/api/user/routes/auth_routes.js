"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user_controller");
const AuthRoutes = express_1.default.Router();
//POST LOGIN
AuthRoutes.post("/login", user_controller_1.login);
//POST SIGNUP
AuthRoutes.post("/signup", user_controller_1.signup);
AuthRoutes.get("/getUserAfterLogin", user_controller_1.getUserAfterLogin);
exports.default = AuthRoutes;
