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
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const router = (0, express_1.Router)();
exports.default = router;
let userId;
router.get("/*", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    try {
        if (authHeader) {
            const user = jsonwebtoken_1.default.verify(authHeader, config_1.JWT_SECRET);
            console.log(user);
            if (user) {
                userId = user.email;
                console.log(userId);
                next();
            }
            else {
                res.status(411).send("User not found");
            }
        }
    }
    catch (e) {
        console.log(e);
        res.status(411).send("Something is wrong");
    }
}));
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
// This will log the current date in DD-MM-YYYY format
router.post("/word", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const today = new Date();
    const date = formatDate(today);
    console.log(date);
    try {
        const insertWord = yield prisma.word.create({
            data: {
                todaysword: body.word,
                description: body.description,
                date: date
            }
        });
        if (insertWord) {
            res.status(200).json({
                msg: "Word is inserted"
            });
        }
    }
    catch (e) {
        console.log(e);
        res.status(411).send("Something is wrong with the inputs");
    }
}));
router.get("/length", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const date = formatDate(today);
    try {
        const word = yield prisma.word.findFirst({
            where: {
                date: date,
            },
        });
        res.status(200).json({
            length: word === null || word === void 0 ? void 0 : word.todaysword.length
        });
    }
    catch (e) {
        console.log(e);
        res.status(411).send("Something is wrong");
    }
}));
router.post("/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("check");
    const inputWord = req.body.inputWord;
    console.log(inputWord);
    let result = new Array();
    let sendResult = new String();
    const today = new Date();
    const date = formatDate(today);
    try {
        const word = yield prisma.word.findFirst({
            where: {
                date: date,
            },
        });
        const todaysWord = (word === null || word === void 0 ? void 0 : word.todaysword) || "";
        console.log(todaysWord);
        let map = new Map();
        for (let i = 0; i < todaysWord.length; i++) {
            if (map.get(todaysWord[i]) != undefined) {
                let value = map.get(todaysWord[i]) || 0;
                value++;
                map.set(todaysWord[i], value);
            }
            else {
                map.set(todaysWord[i], 1);
            }
        }
        for (let i = 0; i < inputWord.length; i++) {
            result.push('0');
        }
        console.log("result size: " + result.length);
        for (let i = 0; i < inputWord.length; i++) {
            if (inputWord[i] == todaysWord[i]) {
                result[i] = '2';
                let value = map.get(todaysWord[i]) || 0;
                value--;
                if (value == 0) {
                    console.log(todaysWord[i] + " letscheck");
                    map.delete(todaysWord[i]);
                    continue;
                }
                map.set(todaysWord[i], value);
            }
        }
        console.log("map after first iteration: ");
        console.log(map);
        for (let i = 0; i < inputWord.length; i++) {
            if (result[i] == '2') {
                continue;
            }
            else {
                if (map.get(inputWord[i]) != undefined) {
                    result[i] = '1';
                    let value = map.get(inputWord[i]) || 0;
                    value--;
                    if (value == 0) {
                        map.delete(inputWord[i]);
                        continue;
                    }
                    map.set(todaysWord[i], value);
                }
            }
        }
        for (let i = 0; i < result.length; i++) {
            console.log(result[i]);
        }
        for (let i = 0; i < result.length; i++) {
            sendResult = sendResult + result[i];
        }
        let checkWord = true;
        for (let i = 0; i < result.length; i++) {
            if (result[i] != '2') {
                checkWord = false;
                break;
            }
        }
        if (checkWord) {
            res.status(200).json({
                result: sendResult,
                description: word === null || word === void 0 ? void 0 : word.description
            });
            return;
        }
        res.status(200).json({
            result: sendResult,
            description: null
        });
    }
    catch (e) {
        console.log(e);
        res.status(411).send("Something is wrong");
    }
}));
