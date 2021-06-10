import { MongoClient } from "mongodb";

export class Database {
  static connection = undefined;

  static async getInstance(url = process.env.DB_CONNECTION_URL) {
    if (Database.connection === undefined) {
      const client = await MongoClient.connect(url).catch((e) => {
        console.log("Database connection error: ", e);
        throw e;
      });
      Database.connection = client.db("ackoo-shops");
      console.log("Database connected successfully!!");
    }
    return Database.connection;
  }
}
