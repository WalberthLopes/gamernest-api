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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_1 = require("../database/supabase");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var userVerify_1 = require("./userVerify");
var createUser_1 = require("./createUser");
var options = {
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: process.env.API_URL,
    preflightContinue: false,
};
var signUp = (0, express_1.default)();
signUp.use(express_1.default.json());
signUp.options("/api/sign-up", (0, cors_1.default)(options));
signUp.post("/api/sign-up", (0, cors_1.default)(options), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, discord, password, response, _b, error, user, uuid, result, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                _a = req.body, username = _a.username, email = _a.email, discord = _a.discord, password = _a.password;
                return [4 /*yield*/, (0, userVerify_1.userVerify)(username, email, discord)];
            case 1:
                response = _c.sent();
                if (!((response === null || response === void 0 ? void 0 : response.success) === false)) return [3 /*break*/, 2];
                res.json(response.message);
                return [3 /*break*/, 6];
            case 2: return [4 /*yield*/, supabase_1.supabase.auth.signUp({
                    email: email,
                    password: password,
                })];
            case 3:
                _b = _c.sent(), error = _b.error, user = _b.user;
                if (!user) return [3 /*break*/, 5];
                uuid = user.id;
                return [4 /*yield*/, (0, createUser_1.createUser)(uuid, username, email, discord, password)];
            case 4:
                result = _c.sent();
                if (result === false) {
                    res.json({
                        message: "Error! Contate o administrador.",
                        success: false,
                    });
                }
                else {
                    res.json({
                        message: "Falta pouco! Verifique seu email.",
                        success: true,
                    });
                }
                return [3 /*break*/, 6];
            case 5:
                console.log(error);
                _c.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_1 = _c.sent();
                console.log(error_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
exports.default = signUp;
