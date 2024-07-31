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
exports.getUserAfterLogin = exports.signup = exports.login = void 0;
const login_validator_1 = require("../validators/login_validator");
const mysql_1 = require("../../../core/connection/mysql");
const signup_validator_1 = require("../validators/signup_validator");
const token_helper_1 = require("../../../features/utils/token_helper");
const base_response_1 = __importDefault(require("../../../core/response/base_response"));
const hash_password_1 = require("../../../features/utils/hash_password");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        yield login_validator_1.loginValidator
            .validate({
            userName,
            password,
        })
            .catch((_) => {
            throw new Error("Validation Error");
        });
        const [row] = yield mysql_1.db.query({ sql: "SELECT * FROM users WHERE user_name = ?", values: [userName] });
        console.log(row[0]);
        if (row.length === 0) {
            return res.status(200).json(base_response_1.default.success("Kullanıcı adı veya şifre yanlış", 1001));
        }
        if (!(yield (0, hash_password_1.comparePassword)(password, row[0].hashed_password))) {
            return res.status(200).json(base_response_1.default.success("Kullanıcı adı veya şifre yanlış", 1001));
        }
        const token = (0, token_helper_1.generateToken)({
            id: row[0].id,
        });
        return res.status(200).json(base_response_1.default.success(token, 200));
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.login = login;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, companyName, userName, password, taxNumber, taxAdministration, taxAdministrationCity, createdAt } = req.body;
        yield signup_validator_1.signUpValidator
            .validate({
            id,
            companyName,
            userName,
            password,
            taxNumber,
            taxAdministration,
            taxAdministrationCity,
        })
            .catch((_) => {
            throw new Error("Validation Error");
        });
        const hashedPassword = yield (0, hash_password_1.hashPassword)(password);
        const checkIsUserUnique = yield mysql_1.db.query({
            sql: "SELECT * FROM users WHERE user_name = ?",
            values: [userName],
        });
        const checkIsTaxNumberUnique = yield mysql_1.db.query({
            sql: "SELECT * FROM users WHERE tax_number = ?",
            values: [taxNumber],
        });
        if (checkIsUserUnique[0].length !== 0) {
            return res.status(200).json(base_response_1.default.fail("Username is already exists", 1003));
        }
        if (checkIsTaxNumberUnique[0].length !== 0) {
            return res.status(200).json(base_response_1.default.fail("Tax Number is already exists", 1004));
        }
        yield mysql_1.db.query({
            sql: "INSERT INTO users (id, company_name, user_name, tax_number, tax_administration, tax_administration_city, hashed_password, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            values: [id, companyName, userName, taxNumber, taxAdministration, taxAdministrationCity, hashedPassword, createdAt],
        });
        const [getId] = yield mysql_1.db.query({
            sql: "SELECT * FROM users where user_name = ?",
            values: [userName],
        });
        const token = (0, token_helper_1.generateToken)({
            id: getId[0].id,
        });
        return res.status(200).json(base_response_1.default.success(token, 201));
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.signup = signup;
const getUserAfterLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = (0, token_helper_1.decodeToken)(token);
        const [row] = yield mysql_1.db.query({
            sql: "SELECT id, company_name, user_name FROM users WHERE id = ?",
            values: [decodedToken],
        });
        console.log(row[0]);
        return res.status(200).json(base_response_1.default.success(row[0], 200));
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.getUserAfterLogin = getUserAfterLogin;
