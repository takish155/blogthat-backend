import { SessionData, Store } from "express-session";
import { createClient } from "redis";

export default class RedisSessionStore extends Store {
  private client;

  constructor() {
    super();

    this.client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 500, 5000), // Retry logic with exponential backoff
      },
    });

    this.client.connect();
  }

  async get(
    sid: string,
    callback: (err: any, session?: SessionData | null) => void
  ) {
    try {
      const session = await this.client.get(`sid:${sid}`);
      callback(null, session ? JSON.parse(session) : null);
    } catch (error) {
      callback(error);
    }
  }

  async set(
    sid: string,
    session: SessionData,
    callback: (err?: any) => void = () => {}
  ) {
    try {
      const ttl = session.cookie.maxAge ? session.cookie.maxAge / 1000 : 86400; // default to 1 day
      await this.client.set(`sid:${sid}`, JSON.stringify(session), { EX: ttl });
      callback();
    } catch (error) {
      callback(error);
    }
  }

  async destroy(sid: string, callback: (err?: any) => void = () => {}) {
    try {
      await this.client.del(`sid:${sid}`);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
