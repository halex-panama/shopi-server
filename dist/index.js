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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const stripe_1 = __importDefault(require("stripe"));
const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const stripe = new stripe_1.default(STRIPE_SECRET_KEY);
app.listen(PORT, () => console.log("Server is running"));
app.post("/create-checkout-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lineItems = req.body.items.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    metadata: {
                        id: item.id,
                    },
                },
                unit_amount: Math.floor(item.discountedPrice * 100),
            },
            quantity: item.quantity,
        };
    });
    const session = yield stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `${CLIENT_URL}/checkout-succes`,
        cancel_url: `${CLIENT_URL}/checkout-failed`,
    });
    res.send(JSON.stringify({
        url: session.url,
    }));
}));
//# sourceMappingURL=index.js.map