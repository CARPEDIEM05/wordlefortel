"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = req.body;
        let role;
        const createUser = yield prisma.user.create({
            data: {
                email: userDetails.email,
                password: userDetails.password,
                name: userDetails.name,
                role: userDetails.role || "user"
            }
        });
        console.log(createUser);
        res.status(200).send("User is created");
        return;
    }
    catch (e) {
        console.log(e);
        res.status(411).send("Something is wrong with the inputs");
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = req.body;
        const email = userDetails.email;
        const password = userDetails.password;
        const getUser = yield prisma.user.findFirst({
            where: {
                email: email,
                password: password
            },
        });
        if (!getUser) {
            res.send("User not found");
            return;
        }
        const token = yield jsonwebtoken_1.default.sign({ email }, config_1.JWT_SECRET);
        res.status(200).json({
            token: token
        });
    }
    catch (e) {
        console.log(e);
        res.status(411).json({
            msg: "Something is not correct with the inputs"
        });
    }
}));
exports.default = router;
