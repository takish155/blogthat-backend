import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import PrismaSessionStore from "./config/PrismaSessionStore";
import "./config/strategy/localStrategy";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = express();

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

// cors
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: new PrismaSessionStore(),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
