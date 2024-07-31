"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    try {
        let x;
        const hashedPassword = yield bcrypt_1.default
            .genSalt(saltRounds)
            .then((salt) => {
            x = bcrypt_1.default.hash(password, salt);
        })
            .then((hash) => {
            console.log("Hash: ", hash);
        })
            .catch((err) => console.log(err.message));
        console.log("x, ", x);
        return x;
    }
    catch (error) {
        throw new Error("Hash hatası: " + error.message);
    }
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const match = yield bcrypt_1.default.compare(password, hashedPassword);
        return match;
    }
    catch (error) {
        throw new Error("Şifre karşılaştırma hatası: " + error.message);
    }
});
exports.comparePassword = comparePassword;
