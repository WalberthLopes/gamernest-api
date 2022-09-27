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
var stripe_1 = __importDefault(require("stripe"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var supabase_1 = require("../database/supabase");
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
var createNewItem = (0, express_1.default)();
var stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-08-01",
});
createNewItem.options("/api/create-new-item", (0, cors_1.default)(options));
createNewItem.post("/api/create-new-item", (0, cors_1.default)(options), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, elements, productUrl, productValue, newProduct, error, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, elements = _a.elements, productUrl = _a.productUrl;
                if (!(!elements.name ||
                    !elements.commands ||
                    !elements.desc ||
                    !elements.position ||
                    !elements.finalValue ||
                    !productUrl)) return [3 /*break*/, 1];
                res.json("NÃO ENVIE CAMPOS VÁZIOS!");
                return [3 /*break*/, 5];
            case 1:
                productValue = (elements.finalValue + 0.39).toFixed(2) * 100;
                return [4 /*yield*/, stripe.products.create({
                        name: elements.name,
                        default_price_data: {
                            unit_amount: productValue,
                            currency: "brl",
                        },
                    })];
            case 2:
                newProduct = _b.sent();
                if (!!newProduct.default_price) return [3 /*break*/, 3];
                res.json("STRIPE ERROR: DEFAULT PRICE NÃO ENCONTRADO!");
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, supabase_1.supabase.from("products").insert([
                    {
                        uuid: newProduct.default_price,
                        name: elements.name,
                        description: elements.desc,
                        price: (elements.finalValue + 0.39).toFixed(2),
                        icon: productUrl,
                        commands: elements.commands,
                        position: elements.position,
                    },
                ])];
            case 4:
                error = (_b.sent()).error;
                if (error) {
                    res.json(error.message.toUpperCase());
                }
                else {
                    res.json("PRODUTO CADASTRADO COM SUCESSO!");
                }
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.log(error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = createNewItem;
