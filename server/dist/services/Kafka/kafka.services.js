import { Kafka } from "kafkajs";
const kafkaclinetId = process.env.KAFKACLINETID;
const kafkabroker = process.env.KAFKABROKERS;
const kafka = new Kafka({
    clientId: kafkaclinetId,
    brokers: [kafkabroker]
});
export default kafka;
