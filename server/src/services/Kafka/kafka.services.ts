import { Kafka } from "kafkajs";



const kafkaclinetId=process.env.KAFKACLINETID as string;
const kafkabroker=process.env.KAFKABROKERS as string;

const kafka=new Kafka({
    clientId:kafkaclinetId,
    brokers:[kafkabroker]
});


export default kafka;
