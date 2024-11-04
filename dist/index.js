"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const PrismaSessionStore_1 = __importDefault(require("./config/PrismaSessionStore"));
require("./config/strategy/localStrategy");
const auth_1 = require("./routes/auth");
const user_1 = require("./routes/user");
const blog_1 = require("./routes/blog");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";
// cors
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    store: new PrismaSessionStore_1.default(),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
}));
// passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// routes
app.use("/api/auth", auth_1.authRouter);
app.use("/api/user", user_1.userRouter);
app.use("/api/blog", blog_1.blogRouter);
app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});
