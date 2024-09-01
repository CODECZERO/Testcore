import AsyncHandler from '../util/ayscHandler.js';
import { ApiResponse } from '../util/apiResponse.js';
import { cacheSearchForChatRoom, cacheUpdateForChatRoom, } from '../db/database.redis.query.js';
import { Response, Request } from 'express';
import { chatModel } from '../models/chatRoomData.model.nosql.js';
import { User } from '../models/user.model.nosql.js';
import { findUsers } from '../db/Query.nosql.db.js';
import { nanoid } from 'nanoid';
import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import { encryptDataFunc } from '../util/cryptographi.util.js';
import { ConsumeMessage } from "amqplib";
import { MessageData, CustomWebSocket, clients, rooms } from '../services/chat/chatServer.service.js';
import rabbitmq from '../services/rabbitmq/rabbitmq.services.js';
import { ApiError } from '../util/apiError.js';
import { parse } from "url";
import { ParsedUrlQuery } from "querystring";
import { options } from './user.controller.js';

type roomData = {
  roomName: string;
  roomID: string;
};

type chatData = {
  chatID: string;
};

type user = {
  Id: string;
};

type encryption = {
  secretKey: string;
  iv: string;
};

interface Requestany extends Request {
  chatRoomData?: any;
  user?: any;
  chatEncryption?: any;
}

//write this fnction
const joinChatRoom = AsyncHandler(async (req: Requestany, res: Response) => {
  const roomdata: roomData = req.chatRoomData;
  const user: user = req.user;
  if (!roomdata || !user) throw new ApiError(400, 'Inviad data provied');
  const findChatID = await chatModel.findOne({
    romeName: roomdata.roomName,
  });
  if (!findChatID) throw new ApiError(404, 'room not found');

  const joinChat = await User.updateOne({
    chatRoomIDs: findChatID?._id,
  });
  //check chai aur backend as there is some command missing here
  if (!joinChat) throw new ApiError(500, 'unable to join chat');
  return res.status(200).json(new ApiResponse(200, joinChat));
});

const createChatRoom = AsyncHandler(async (req: Requestany, res: Response) => {
  const roomData: roomData = req.chatRoomData;
  const { Id } = req.user;
  const encryptCode = 'fsf';
  if (!Id || !roomData || !encryptCode)
    throw new ApiError(400, 'group name or Admin id is not provided');
  const secretKey = nanoid(32);
  const iv = randomBytes(16);
  if (!(secretKey || iv)) throw new ApiError(500, 'error while making keys');
  const createRoom = await chatModel.create({
    romeName: roomData.roomName,
    encryptCode: secretKey,
    AdminId: Id,
  });
  if (!createRoom) throw new ApiError(500, 'unable to create chat group');
  await cacheUpdateForChatRoom(
    roomData.roomName,
    JSON.stringify(createRoom?._id),
  );
  return res.status(200).json(new ApiResponse(200, createRoom));
});

const getUserInChat = AsyncHandler(async (req: Requestany, res: Response) => {
  const roomdata: roomData = req.chatRoomData;
  const { Id } = req.user;
  if (!roomdata) throw new ApiError(400, 'Inviad data provied');
  const getUser = await findUsers(roomdata.roomName, undefined, Id);
  if (!getUser) throw new ApiError(500, 'unable to find total users');
  return res.status(200).json(new ApiResponse(200, getUser, 'Total user'));
});

const deleteChat = AsyncHandler(async (req: Requestany, res: Response) => {
  //cruently working on this feature
  const chatdata: chatData = req.chatRoomData;
  if (!chatdata) throw new ApiError(400, 'invalid data');
  // const modifi = await ;
  // if (!modifi) throw new ApiError(500, "unable to delete chat");
  // return res.status(200).json(new ApiResponse(200, modifi, "message deleted"));
});

const modifiChat = AsyncHandler(async () => { });

// const SendMessageEncryption = AsyncHandler(async () => {
//      const roomData:roomData=cacheSearchForChatRoom();
//      if(!(roomData||secretData)) throw new ApiError(401,"secretData or roomData is not found")
//     const encryptChatData=await encryptDataFunc(req.body,secretData.secretKey,secretData.iv as Buffer);//figure out how will you handle issue with

// });

// const ReciveMessageDecryption = AsyncHandler(async (req:Requestany,res:Response) => {// this function should be taken care on user/client side

// });

const LeaveRoom = AsyncHandler(async (req: Requestany, res: Response) => {
  //it removes the users from that particure chat permantly
  const roomData: roomData = req.chatRoomData;
  const user: user = req.user;
  if (!(roomData || user)) throw new ApiError(400, 'invalid data');
  const findChatID = await chatModel.findOne({
    romeName: roomData.roomName,
  });
  const removeUser = await User.updateOne(
    { _id: new mongoose.Types.ObjectId(user.Id) },
    { $pull: { chatRoomIDs: new mongoose.Types.ObjectId(findChatID?._id) } },
  );
  if (!removeUser) throw new ApiError(406, 'User unable to remove');
  return res.status(200).json(new ApiResponse(200, removeUser, 'user remvoe'));
});

const checkUserAccess = async (userId:string,roomID:string) => {//should be called when user enter in chat app or chat window, only one time it, should be called
  //checks wheater user is part of that chat room

 
  try {
    const checkUserChatAccess = await User.aggregate([
      {
        $match: {
          sqlId: new mongoose.Types.ObjectId(userId),
          chatRoomIDs: { $eq: new mongoose.Types.ObjectId(roomID) },
        },
      },
      {
        $lookup: {
          from: 'chatmodels',
          localField: 'chatRoomIDs',
          foreignField: '_id',
          as: 'ChatUsers',
        },
      },
      {
        $project: {
          _id: 1,
          ChatUsers: 1,
        },
      },
    ]);
    if (!checkUserChatAccess || checkUserChatAccess.length === 0)
      throw new ApiError(409, "user don't have access to chat ");
  
    return checkUserChatAccess[0];
  } catch (error) {
      return new ApiError(500,"Something went wrong while checking user access");
  }
}

const connectChat = AsyncHandler(async (req: Requestany, res: Response) => {
  const roomData: roomData = req.chatRoomData;
  const user: user = req.user;
  if (!roomData) throw new ApiError(400, 'invalid request');
  const Checker= await checkUserAccess(user.Id,roomData.roomID);
  if(Checker instanceof ApiError) throw new ApiError(500,"someting went wrong while checking user access");
  //call token generater here
  const tokenGen="dfd";
  return res.status(200).cookie("UserchatsAccess",Checker,options).json(new ApiResponse(200,Checker));

})

const sendMessage = async (MessageData: MessageData, ws: CustomWebSocket,) => {//message send function
  try {
    const messageInfo = JSON.stringify(MessageData);//converts message pattern to string or json to string
    // const messageEnc=await SendMessageEncryption();//it a enctyption function, which encrypts message bfore sending,it to queue
    //so only the user/group/group member person can only open/read that message
    rabbitmq.publishData(JSON.stringify(MessageData), MessageData.roomName);//publishing or send data to rabbitmq queue, so it can make record of message for 7 day
    //or for user defin time and it's a way of scaling the whole chat feature/application, insted of rabbitmq you can use kafka as it will be fast and quit robust

  } catch (error) {
    throw new ApiError(500, "error while sending message");//throw error if any thing went wrong, so later the dev can debug it 
  }
}

const sendMessageToReciver = async (message: ConsumeMessage, ws: CustomWebSocket) => {//takes message from queue and then send it, to the right user 
  try {
    await clients.forEach(client => {//send message to user, who are the member of the group 
      if (message && client != ws && client.readyState === ws.OPEN) {//checks, if webscoket and message exist,if the set of websocket or websocket is ready
        //or open,then send message 
        client.send(JSON.stringify(message));//takes message from rabbitmq queue
      }
    });
  } catch (error) {
    throw new ApiError(500, "error while receiving message");//throw error if any thing went wrong, so later the dev can debug it 

  }
}

const reciveMEssage = async (roomName: string, ws: CustomWebSocket) => {//recive message function
  try {
    const messageEnc = await rabbitmq.subData(roomName);//subscribe to the queue, the queue name is same as roomName 
    await rabbitmq.channel.consume(rabbitmq.queue.queue, (message: ConsumeMessage | null) => {//consume the message from queue and uses a call back where it the message exitst
      //send it to user 

      if (message) sendMessageToReciver(message, ws);


    })
  } catch (error) {
    throw new ApiError(500, "error while reciveing message");//throw error if any thing went wrong, so later the dev can debug it 
  }
}

const closeSocket = async (MessageData: MessageData, ws: CustomWebSocket) => {//closeSocket function or close the connection between the user and server
  try {
    rooms[MessageData.roomName].delete(ws);//checks the roomName in the collection of the rooms and removes the websocket connection from that room
    //rooms is a object which has information about how many users are connected to server as any user close's or end the connection with server
    //it will remove user from object 
    if (rooms[MessageData.roomName].size === 0) {//if there is no one in the current websocket server of that room or user of a room are not connected to the
      //websocket, it will delete the room from the rooms(object of room);.
      delete rooms[MessageData.roomName];
    }
  } catch (error) {
    throw new ApiError(500, "error while closeing socket")//throw error if any thing went wrong, so later the dev can debug it 
  }
}

const closeConnection = async () => {
  try {
    await rabbitmq.closeConnection();
  } catch (error) {
    throw new ApiError(500, "error while closeing connection")//throw error if any thing went wrong, so later the dev can debug it 

  }
}

const tokenGenforWebsocket = async () => {

}

const tokenExtractr = (req: Request) => {//takes requset object from websocket extract token from it.
  const parsedUrl = parse(req.url || " ", true);//it parse query as string
  const queryParams: ParsedUrlQuery = parsedUrl.query;//takes query from parsedUrl and  
  const tokenFroUser: string = queryParams?.token as string;




}

export {
  createChatRoom,
  joinChatRoom,
  connectChat,
  checkUserAccess,
  LeaveRoom,
  deleteChat,
  modifiChat,
  // SendMessageEncryption,
  // ReciveMessageDecryption,
  getUserInChat,
  sendMessage,
  reciveMEssage,
  closeSocket,
  closeConnection,
  tokenExtractr
};