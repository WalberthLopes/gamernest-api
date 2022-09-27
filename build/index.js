"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require("dotenv/config");
// Auth
var getCurrentUser_1 = __importDefault(require("./auth/getCurrentUser"));
var signIn_1 = __importDefault(require("./auth/signIn"));
var signUp_1 = __importDefault(require("./auth/signUp"));
var signOut_1 = __importDefault(require("./auth/signOut"));
// Stripe api
var paymentCheckout_1 = __importDefault(require("./shop/paymentCheckout"));
var sendProductsData_1 = __importDefault(require("./shop/sendProductsData"));
var checkoutFullfillment_1 = __importDefault(require("./shop/checkoutFullfillment"));
// User profile informations
var getUserKeys_1 = __importDefault(require("./account/getUserKeys"));
var createNewItem_1 = __importDefault(require("./shop/createNewItem"));
var app = (0, express_1.default)();
var port = process.env.PORT || 3001;
app.use(checkoutFullfillment_1.default);
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.send("Gamernest Entertainment");
});
// Auth
app.use(getCurrentUser_1.default);
app.use(signIn_1.default);
app.use(signUp_1.default);
app.use(signOut_1.default);
// Stripe api
app.use(paymentCheckout_1.default);
app.use(sendProductsData_1.default);
app.use(createNewItem_1.default);
// User profile informations
app.use(getUserKeys_1.default);
app.listen(port, function () {
    console.log("*" + "\n" + "Server is running on port:", port + "\n" + "*");
});
