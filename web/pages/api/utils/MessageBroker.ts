import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";

// https://medium.com/swlh/communicating-using-rabbitmq-in-node-js-e63a4dffc8bb

type MessageHandler = (message: ConsumeMessage, ack: () => void) => void;
type JsonMessageHandler<T = object> = (
  message: ConsumeMessage,
  ack: () => void,
  json: T
) => void;

class MessageBroker {
  static instance: MessageBroker;

  connection: Connection;
  channel: Channel;
  queues: Record<string, MessageHandler[]> = {}; // TODO

  private async init() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    return this;
  }

  static async getInstance() {
    if (!MessageBroker.instance) {
      const broker = new MessageBroker();
      MessageBroker.instance = await broker.init();
    }
    return MessageBroker.instance;
  }

  async send(queue: string, msg: Buffer) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, msg);
  }

  async sendJson(queue: string, msg: object) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
  }

  async subscribe(queue: string, handler: MessageHandler) {
    if (this.queues[queue]) {
      const existingHandler = this.queues[queue].find((h) => h === handler);
      if (existingHandler) {
        return () => this.unsubscribe(queue, existingHandler);
      }
      this.queues[queue].push(handler);
      return () => this.unsubscribe(queue, handler);
    }

    await this.channel.assertQueue(queue, { durable: true });
    this.queues[queue] = [handler];
    this.channel.consume(queue, async (msg) => {
      const ack = once(() => this.channel.ack(msg));
      this.queues[queue].forEach((h) => h(msg, ack));
    });
    return () => this.unsubscribe(queue, handler);
  }

  async subscribeJson<T = object>(
    queue: string,
    handler: JsonMessageHandler<T>
  ) {
    this.subscribe(queue, (message, ack) => {
      handler(message, ack, JSON.parse(message.content.toString()));
    });
  }

  async unsubscribe(queue, handler) {
    this.queues[queue] = this.queues[queue].filter((h) => h !== handler);
  }
}

function once(func) {
  let result;
  let called;
  return function (...args) {
    if (!called) {
      result = func.apply(this, args);
      func = undefined;
    }
    return result;
  };
}

export default MessageBroker;
