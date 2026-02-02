import amqp from "amqplib";
import env from "../utility/env";

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection["createChannel"]>>;

export class Queue {
  private connection: AmqpConnection | null = null;
  private channel: AmqpChannel | null = null;

  private readonly url: string;
  private readonly queueName: string;

  constructor(queueName: string, url: string = env.QUEUE_URL) {
    this.queueName = queueName;

    this.url = url.includes("?")
      ? `${url}&heartbeat=60`
      : `${url}?heartbeat=60`;
  }

  private resetConnection() {
    console.warn(`♻️ Resetting connection state for ${this.queueName}...`);
    this.connection = null;
    this.channel = null;
  }

  public async initConnection(): Promise<void> {
    if (this.connection) return;

    try {
      console.log(`🔌 Connecting to RabbitMQ: ${this.queueName}...`);
      const conn = await amqp.connect(this.url);

      conn.on("error", (err) => {
        console.error("🔥 AMQP Connection Error:", err.message);
        this.resetConnection();
      });

      conn.on("close", () => {
        console.warn("⚠️ AMQP Connection Closed.");
        this.resetConnection();
      });

      this.connection = conn;
      this.channel = await conn.createChannel();

      await this.channel.assertQueue(this.queueName, { durable: true });
      console.log(`✅ Connected to: ${this.queueName}`);
    } catch (error) {
      console.error("Connection failed:", error);
      this.resetConnection();
      throw error;
    }
  }

  public async getChannel(): Promise<AmqpChannel> {
    if (!this.connection || !this.channel) {
      await this.initConnection();
    }

    if (!this.channel) {
      throw new Error("Channel failed to initialize");
    }
    return this.channel;
  }

  public async sendMessage(message: any): Promise<void> {
    try {
      const channel = await this.getChannel();

      await channel.assertQueue(this.queueName, { durable: true });

      channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
      console.log(`Sent to ${this.queueName}:`, message);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  public async consumeMessageQueue(
    onMessage: (message: any) => Promise<void>
  ): Promise<void> {
    try {
      const channel = await this.getChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      console.log(`🎧 Listening on: ${this.queueName}`);

      channel.consume(this.queueName, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await onMessage(content);
            channel.ack(msg);
          } catch (error) {
            console.error("Processing error:", error);
            channel.nack(msg);
          }
        }
      });

      this.channel?.on("close", () => {
        console.log("Consumer channel closed");
      });
    } catch (error) {
      throw error;
    }
  }
}
