import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";
import { prisma } from "../prisma";

passport.serializeUser((id, done) => {
  done(null, id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id as string },
    });
    if (!user) {
      throw new Error("User not found");
    }

    done(null, user.id);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error("Invalid credentials");
      }

      done(null, user.id);
    } catch (error) {
      done(error);
    }
  })
);
