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

  private async initializeConsumer() {
    console.log("Starting Chat Worker...");
    await this.messageQueue.consumeMessageQueue(async (msg) => {
      try {
        await db.insert(message).values({
          roomId: msg.roomId,
          userId: msg.userId,
          content: msg.message,
          sentAt: new Date(msg.timestamp),
        });
      } catch (error) {
        console.error("DB Insert Error:", error);
      }
    });
  }

  public async enqueueMessage(data: {
    roomId: string;
    userId: string;
    username: string;
    message: string;
  }) {
    const payload = { ...data, timestamp: Date.now() };
    await this.messageQueue.sendMessage(payload);
  }

  public async getRoomHistory(roomId: string, limit = 50) {
    const result = await db
      .select({
        id: message.id,
        content: message.content,
        sentAt: message.sentAt,
        userId: message.userId,
        username: user.username,
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
