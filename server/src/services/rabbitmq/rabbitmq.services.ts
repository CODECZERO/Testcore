import amqplib from 'amqplib';

class rabbitMqFunction {
    private exchangeName = 'chat_exchagne';
    private messageTTL = '';
    public channel: any;
    public queue: any;
    // private queueName = "MessageStore"
    public connectRabbitMq = async (MessageEnc: string, roomName: string) => {
        const connection = await amqplib.connect(process.env.RABBITMQURL as string);
        const channel = await connection.createChannel();
        await channel.assertExchange(this.exchangeName, roomName, {
            durable: true,
        });
        this.channel = channel;
    };

    public publishData = async (messageEnc: string, roomName: string) => {
        await this.channel.publish(
            this.exchangeName,
            roomName,
            Buffer.from(messageEnc),
            { persistent: true },
        );
    };

    public subData = async (roomName: string) => {
        this.queue = await this.channel.assertQueue(roomName, { exclusive: false });
        const message = await this.channel.bindQueue(
            this.queue.queue,
            this.exchangeName,
            roomName,
        );
        return message;
    };
}

export default rabbitMqFunction;
