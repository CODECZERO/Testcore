import AsyncHandler from '../util/ayscHandler.js';
import { ApiResponse } from '../util/apiResponse.js';
import { cacheSearchForChatRoom, cacheUpdateForChatRoom, } from '../db/database.redis.query.js';
import { Response, Request } from 'express';
import { chatModel } from '../models/chatRoomData.model.nosql.js';
import { User } from '../models/user.model.nosql.js';
import { findChats, findUsers } from '../db/Query.nosql.db.js';
import mongoose from 'mongoose';
import { ApiError } from '../util/apiError.js';
import { options } from './user.controller.js';
import { ChatTokenGen } from '../services/chat/chatToken.services.js';


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


const joinChatRoom = AsyncHandler(async (req: Requestany, res: Response) => {//using this function a user can join chat
  const roomdata: roomData = req.chatRoomData;//takes data about room
  const user: user = req.user;//takes user id or uder data

  if (!roomdata.roomName || !user.Id) throw new ApiError(400, 'Inviad data provied');//if any of theme is not provided then throw error

  const findChatID = await chatModel.findOne({//find chat Id in chatmodel collection
    romeName: roomdata.roomName,
  });

  if (!findChatID) throw new ApiError(404, 'room not found');

  const joinChat = await User.updateOne({//after finding room it will help user to join the room and update value in database
    sqlId: user.Id
  }, {
    chatRoomIDs: findChatID._id,//taking chat id and puting here
  });

  if (!joinChat) throw new ApiError(500, 'unable to join chat');//if unable to do so , then throw error
  return res.status(200).json(new ApiResponse(200, joinChat));//else return value
});

const createChatRoom = AsyncHandler(async (req: Requestany, res: Response) => {//if a user want to create chat room then, this function will help theme
  const roomData: roomData = req.body;
  const { Id } = req.user;//takes data from client

  if (!Id || !roomData.roomName)
    throw new ApiError(400, 'group name or Admin id is not provided');//if not provided then throw error

  const user = await User.findOne({//fiding user using client data
    sqlId: Id
  });

  if (!user) throw new ApiError(404, "No user Found");


  const createRoom = await chatModel.create({//making chat room in chatmodel 
    romeName: roomData.roomName,
    AdminId: user?._id,
  });

  if (!(createRoom)) throw new ApiError(500, 'unable to create chat group');

 await cacheUpdateForChatRoom(//updating data in cahce so it's , easly accessed
    roomData.roomName,
    JSON.stringify(createRoom?._id),
  );

  return res.status(200).json(new ApiResponse(200, createRoom));//return data
});

const getUserInChat = AsyncHandler(async (req: Requestany, res: Response) => {//get user in a chat group
  const roomdata: roomData = req.chatRoomData;
  const { Id } = req.user;//takes data from client

  if (!roomdata) throw new ApiError(400, 'Inviad data provied');
  const getUser = await findUsers(roomdata.roomID.replace(/"/g, ''), undefined, Id);//get user using findUsers function which is a mongoose nested query

  if (!getUser) throw new ApiError(500, 'unable to find total users');
  return res.status(200).json(new ApiResponse(200, getUser, 'Total user'));//return data on success
});

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

  const findChatID = await chatModel.findOne({//check if user is part of that chat
    romeName: roomData.roomName,
  });
  const removeUser = await User.updateOne(//after that remove user from chat group
    { sqlId: user.Id },
    { $pull: { chatRoomIDs: new mongoose.Types.ObjectId(findChatID?._id) } },
  );
  if (!removeUser) throw new ApiError(406, 'User unable to remove');
  return res.status(200).json(new ApiResponse(200, removeUser, 'user remvoe'));//return data
});

const checkUserAccess = async (userId: string, roomID: string) => {//should be called when user enter in chat app or chat window, only one time it, should be called
  //checks wheater user is part of that chat room
  //it a function which is used in other controler
  try {
    const checkUserChatAccess = await User.aggregate([//uses aggreagation, where it joins two sperate document/collection
      {
        $match: {
          sqlId: new mongoose.Types.ObjectId(userId),//takes user id and search in database
          chatRoomIDs: { $eq: new mongoose.Types.ObjectId(roomID) },//and also take room id of chat
        },
      },
      {
        $lookup: {//looks for data in chatmodel
          from: 'chatmodels',
          localField: 'chatRoomIDs',
          foreignField: '_id',
          as: 'ChatUsers',
        },
      },
      {
        $project: {//return id and chatuser data
          _id: 1,
          ChatUsers: 1,
        },
      },
    ]);
    if (!checkUserChatAccess || checkUserChatAccess.length === 0)
      throw new ApiError(409, "user don't have access to chat ");//if data is 0 and some how not provided then throw error

    return checkUserChatAccess[0];//else reutnr first value
  } catch (error) {
    return new ApiError(500, "Something went wrong while checking user access");
  }
}

const connectChat = AsyncHandler(async (req: Requestany, res: Response) => {//if you are accessing chat room it will check if you have access to it
  const roomData: roomData = req.chatRoomData;//takes parametrs
  const user: user = req.user;
  if (!roomData) throw new ApiError(400, 'invalid request');//throw error if not provided
  const Checker = await checkUserAccess(user.Id, roomData.roomID);//check in database if user have access to the chat room
  if (!Checker) throw new ApiError(409, "user don't have access to chat");//if fail then throw error
  //call token generater here
  const tokenGen = await ChatTokenGen(Checker[0]);//takes first value and gen token based on that data
  if (!tokenGen) throw new ApiError(500, "someting went wrong while making token");//if token not gen then throw error
  return res.status(200).cookie("UserChatToken", tokenGen, options).json(new ApiResponse(200, Checker, "Token create succesfuly"));//reutrn response

})

const getChats = AsyncHandler(async (req: Requestany, res: Response) => {//this function helps us to get chatroom and chat data
  const user: user = req.user;
  if (!user.Id) throw new ApiError(400, "user id not provied");
  const ChatDatas = await findChats(user.Id);
  if (!ChatDatas) throw new ApiError(404, "no chat room currently");
  return res.status(200).json(new ApiResponse(200, ChatDatas, "chat rooms found"));
})

export {
  createChatRoom,
  joinChatRoom,
  checkUserAccess,
  LeaveRoom,
  getUserInChat,
  connectChat,
  getChats
};