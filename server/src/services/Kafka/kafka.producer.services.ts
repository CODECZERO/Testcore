import kafka from "./kafka.services.js";


type messageData={
    MessageId:string,
    Message:string
}
const Producer=kafka.producer();

const connectProducer=async()=>{
   await Producer.connect();
}

const sendMessageOnKafka=async(topicName:string,messagedata:messageData)=>{
    Producer.send({
        topic:topicName.toString(),
        messages:[
           {
            value:`${messagedata.MessageId,messagedata.Message}`
           } 
        ]

    })
}

const disconnectProducer=async()=>{
    Producer.disconnect();
}

export {
    connectProducer,
    sendMessageOnKafka,
    disconnectProducer
}