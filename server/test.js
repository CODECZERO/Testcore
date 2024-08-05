import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient
const users = async () => {
  return await prisma.user.create({
    data: {
      email: 'cbd@gamil.com',
      name: 'dfdf',
    },
  })
}

const find=async()=>{
  return await prisma.user.findUnique({
    where:{
      email:"cbd@gamil.com"
    },
    select:{
      name:true
  }})
}

const user=await find();

console.log(user);