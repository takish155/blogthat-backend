import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/strategy/localStrategy";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import RedisSessionStore from "./config/RedisSessionStore";

const app = express();

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

// cors
app.use(
  cors({
    origin: "https://blogthat.vercel.app",
    credentials: true,
  })
);

// helmet security
// app.use(
//   helmet({
//     contentSecurityPolicy: false, // Disable CSP in dev to avoid interference
//     hsts: false, // Disable HSTS in development (no HTTPS)
//     crossOriginEmbedderPolicy: false, // Allow cross-origin embedding
//   })
// );

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: new RedisSessionStore(),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "none",
      httpOnly: true,
      secure: true,
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
