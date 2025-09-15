import {PrismaClient} from "@prisma/client";

export class DatabaseManager {
  private database?: PrismaClient;

  getInstance(): PrismaClient {
    if (!this.database) {
      this.database = new PrismaClient();
    }
    return this.database;
  }

  async close(): Promise<void> {
    if (!this.database) return;
    await this.database.$disconnect();
  }
}

export const databaseManager = new DatabaseManager();
