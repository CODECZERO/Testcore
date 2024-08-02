import mongoose from 'mongoose';
const connectDb=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}`);
        return "connected";
    } catch (error) {
        console.log(`There is error while connecting to db \n \t ${error} `)
        process.exit(1);
    }
}

export {connectDb};