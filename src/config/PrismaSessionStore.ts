import { SessionData, Store } from "express-session";
import { prisma } from "./prisma";

export default class PrismaSessionStore extends Store {
  constructor() {
    super();
  }

  async get(
    sid: string,
    callback: (err: any, session?: SessionData | null) => void
  ) {
    try {
      const session = await prisma.session.findUnique({
        where: { sid },
      });

      if (session) {
        return callback(null, JSON.parse(session.data!));
      }

      callback(null, null);
    } catch (error) {
      callback(error);
    }
  }

  async set(sid: string, session: SessionData, callback?: (err?: any) => void) {
    try {
      const expiresAt = session.cookie.expires
        ? new Date(session.cookie.expires)
        : null;

      await prisma.session.upsert({
        where: { sid },
        create: {
          sid,
          data: JSON.stringify(session),
          expiresAt,
        },
        update: {
          data: JSON.stringify(session),
          expiresAt,
        },
      });

      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      const session = await prisma.session.findUnique({
        where: { sid },
      });

      if (!session) {
        console.log(`Session ${sid} not found`);
        callback?.();
        return;
      }

      await prisma.session.delete({
        where: { sid },
      });

      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }
}
