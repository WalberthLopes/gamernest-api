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
var supabase_1 = require("../database/supabase");
var endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
var checkoutFullfillment = (0, express_1.default)();
var stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-08-01",
});
checkoutFullfillment.post("/webhook", express_1.default.raw({ type: "application/json" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var event, payload, sig, _a, session, error, error_1, session, error, session, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                payload = req.body;
                sig = req.headers["stripe-signature"];
                if (sig == null) {
                    throw new Error("No stripe signature found!");
                }
                try {
                    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
                }
                catch (err) {
                    console.log("\u274C Failed: ".concat(err.message));
                    res.status(400).send("Webhook failed: ".concat(err.message));
                    return [2 /*return*/];
                }
                _a = event.type;
                switch (_a) {
                    case "checkout.session.completed": return [3 /*break*/, 1];
                    case "checkout.session.async_payment_succeeded": return [3 /*break*/, 5];
                    case "checkout.session.async_payment_failed": return [3 /*break*/, 7];
                }
                return [3 /*break*/, 9];
            case 1:
                session = event.data.object;
                return [4 /*yield*/, supabase_1.supabase
                        .from("user_payments")
                        .update({ status: "awaiting" })
                        .match({ id: session.id })];
            case 2:
                error = (_b.sent()).error;
                if (error) {
                    console.log(error);
                }
                if (!(session.payment_status === "paid")) return [3 /*break*/, 4];
                return [4 /*yield*/, supabase_1.supabase
                        .from("user_payments")
                        .update({ status: session.payment_status })
                        .match({ id: session.id })];
            case 3:
                error_1 = (_b.sent()).error;
                if (error_1) {
                    console.log(error_1);
                }
                _b.label = 4;
            case 4: return [3 /*break*/, 9];
            case 5:
                session = event.data.object;
                return [4 /*yield*/, supabase_1.supabase
                        .from("user_payments")
                        .update({ status: session.payment_status })
                        .match({ id: session.id })];
            case 6:
                error = (_b.sent()).error;
                if (error) {
                    console.log(error);
                }
                return [3 /*break*/, 9];
            case 7:
                session = event.data.object;
                return [4 /*yield*/, supabase_1.supabase
                        .from("user_payments")
                        .update({ status: session.payment_status })
                        .match({ id: session.id })];
            case 8:
                error = (_b.sent()).error;
                if (error) {
                    console.log(error);
                }
                return [3 /*break*/, 9];
            case 9:
                console.log("✅ Success:", event.id);
                res.status(200);
                return [2 /*return*/];
        }
    });
}); });
exports.default = checkoutFullfillment;
