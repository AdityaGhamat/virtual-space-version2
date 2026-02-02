import { db } from "../../core/database";
import { message, user } from "../../core/database/schema";
import { eq, desc } from "drizzle-orm";
import { Queue } from "../../core/queue/queue";

class MessageService {
  private messageQueue: Queue;

  constructor() {
    this.messageQueue = new Queue("chat_messages");
    this.initializeConsumer();
  }

  // --- WORKER: Reads from Queue -> Writes to DB ---
  private async initializeConsumer() {
    console.log("Starting Chat Worker...");
    await this.messageQueue.consumeMessageQueue(async (msg) => {
      try {
        // Map Queue payload -> DB Schema
        await db.insert(message).values({
          roomId: msg.roomId,
          userId: msg.userId, // UUID
          content: msg.message, // Map 'message' -> 'content'
          sentAt: new Date(msg.timestamp),
        });
      } catch (error) {
        console.error("DB Insert Error:", error);
      }
    });
  }

  // --- PRODUCER: Sends to Queue ---
  public async enqueueMessage(data: {
    roomId: string;
    userId: string;
    username: string;
    message: string;
  }) {
    // Add timestamp for consistency
    const payload = { ...data, timestamp: Date.now() };
    await this.messageQueue.sendMessage(payload);
  }

  // --- READER: Fetches History (with JOIN) ---
  public async getRoomHistory(roomId: string, limit = 50) {
    // JOIN 'message' table with 'user' table to get the username
    const result = await db
      .select({
        id: message.id,
        content: message.content,
        sentAt: message.sentAt,
        userId: message.userId,
        username: user.username, // Get username from user table
      })
      .from(message)
      .leftJoin(user, eq(message.userId, user.id))
      .where(eq(message.roomId, roomId))
      .orderBy(desc(message.sentAt))
      .limit(limit);

    return result;
  }
}

export default new MessageService();
