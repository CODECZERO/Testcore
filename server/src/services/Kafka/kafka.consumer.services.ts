import kafka from "./kafka.services.js";


const consume = async (roomName:string) => {
    const consumer = kafka.consumer({groupId:roomName});
    await consumer.connect()
    await consumer.subscribe({ topic:roomName, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message}) => {
          console.log({
            groupId: topic,
            partition,
            value: message,
          });
        },
      });
    
}

export {consume}
