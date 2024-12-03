---
title: API of Testcore
---
# **TestCore API Structure**

The TestCore API is divided into the following subsystems:

1. **Chat API**: Handles chat-related operations like creating and managing chat rooms.

2. **Video API**: Manages video calls and recording sessions.

3. **User API**: Handles user authentication, profiles, and account settings.

4. **Logging API**: Tracks application logs and user activity.

5. **Notification System API**: Manages notifications via email, SMS, and push notifications.

## **Chat API**

The **Chat API** facilitates various chat-related functionalities within the TestCore system, such as creating chat rooms, retrieving chat room information, and managing group chats. The API interacts with a NoSQL database (MongoDB) and a Redis cache for optimized data retrieval and storage.

---

#### **Base Route**

`/api/v1/chat`

---

### **Endpoints**

### **1. Create Chat Room**

**Route**: `/api/v1/chat/createChat`\
**Method**: `POST`

**Purpose**:\
This route is used to create a new chat room in the system, allowing users to connect and communicate with one another.

<SwmSnippet path="/server/src/controller/chat.controller.ts" line="61">

---

/createChat

```typescript
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

  const data = await cacheUpdateForChatRoom(//updating data in cahce so it's , easly accessed
    roomData.roomName,
    JSON.stringify(createRoom?._id),
  );

  return res.status(200).json(new ApiResponse(200, createRoom));//return data
});
```

---

</SwmSnippet>

**Process Flow**:

1. **Validate Input**:\
   The backend validates the `roomName` and `userId` from the request body.

2. **Check User Existence**:

   - Queries the NoSQL database (MongoDB) to verify if the user with the provided `userId` exists.

   - If the user is not found, an appropriate error response is returned.

3. **Update Chat Room Data**:

   - Checks if a chat room with the specified `roomName` already exists.

   - If the room exists, updates the room's data (e.g., adding the user to the room).

   - If the room does not exist, creates a new chat room document in the `chatModel` collection of MongoDB.

4. **Update Redis Cache**:

   - Stores or updates the chat room's details in Redis to optimize future lookups.

5. **Return Room Data**:

   - Sends a response containing the details of the created or updated chat room.

&nbsp;

**Optimizations**:

1. **Redis Integration**:\
   Redis is used as a caching layer to improve performance, enabling chat rooms to be quickly retrieved without querying MongoDB directly.

2. **Scalability**:

   - The API is designed to handle concurrent requests efficiently.

   - Using NoSQL ensures that the database can scale horizontally with minimal overhead.

&nbsp;

### **2. Chat Query**

Endpoint: `/ChatQuery/:College/:Branch`

This endpoint provides three distinct methods (\`POST\`, `PUT`, `GET`) to manage chat room operations for a specific college and branch. Each method is designed for specific functionality as detailed below:

&nbsp;

**1. POST Method: Join a Chat Room**

Purpose: Allows a user to join a specific chat room.&nbsp;&nbsp;

Workflow:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Takes data (e.g., user details and room information) from the frontend.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Searches for the specified chat room in the `ChatModel` collection in MongoDB.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Updates the user's document in MongoDB to include the chat room details, granting the user access to the chat room.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Ensures that the chat room data in the `ChatModel` is updated accordingly.&nbsp;&nbsp;

<SwmSnippet path="/server/src/controller/chat.controller.ts" line="39">

---

&nbsp;

```typescript
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
```

---

</SwmSnippet>

&nbsp;

**2. PUT Method: Leave a Chat Room**

Purpose: Allows a user to leave a specific chat room.&nbsp;&nbsp;

Workflow:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Takes data (e.g., user ID and chat room information) from the frontend.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Removes the chat room details from the user's document in MongoDB, revoking the user's access to the chat room.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Updates the `ChatModel` collection to reflect the removal of the user from the chat room.&nbsp;&nbsp;

<SwmSnippet path="/server/src/controller/chat.controller.ts" line="112">

---

&nbsp;

```typescript
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
```

---

</SwmSnippet>

&nbsp;

**3. GET Method: Get Details of Users in a Chat Room**

Purpose: Retrieves the list of all users present in a specific chat room, along with their details.&nbsp;&nbsp;

Workflow:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Takes the room name from the request parameters.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Utilizes a middleware function, `searchRoomId`, which converts the room name to its corresponding `roomId`.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Calls an internal function, `findUsers`, to perform an aggregation query between the `ChatModel` and `User` collections     in MongoDB.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;-  Returns the total number of users in the chat room and their respective details.&nbsp;&nbsp;

<SwmSnippet path="/server/src/controller/chat.controller.ts" line="90">

---

&nbsp;

```typescript
const getUserInChat = AsyncHandler(async (req: Requestany, res: Response) => {//get user in a chat group
  const roomdata: roomData = req.chatRoomData;
  const { Id } = req.user;//takes data from client

  if (!roomdata) throw new ApiError(400, 'Inviad data provied');
  const getUser = await findUsers(roomdata.roomID.replace(/"/g, ''), undefined, Id);//get user using findUsers function which is a mongoose nested query

  if (!getUser) throw new ApiError(500, 'unable to find total users');
  return res.status(200).json(new ApiResponse(200, getUser, 'Total user'));//return data on success
});

```

---

</SwmSnippet>

&nbsp;

**Key Notes:**

\- All methods ensure efficient data retrieval and updates using MongoDB aggregation pipelines and optimized queries.&nbsp;&nbsp;

\- The API is designed to handle authentication and authorization to secure access to chat rooms and user data.&nbsp;&nbsp;

&nbsp;

&nbsp;

### **3. Connect chat**

#### **API Endpoint:** `/connectChat/:College/:Branch`

**Method:** `POST`

**Purpose: Establishes a connection to a chat room for a user, ensuring access is authorized and secure through token generation.**

&nbsp;

Workflow:&nbsp;&nbsp;

1\. Middleware Usage:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- searchChatRoom: Extracts and verifies chat room details based on the provided `College` and `Branch`.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- verifyData: Retrieves and validates user data, ensuring the user’s identity and credentials are authentic.&nbsp;&nbsp;

2\. Access Verification:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- Checks if the user has the required permissions or access rights to the chat room.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- If the user is authorized, proceeds to the next step.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- If the user does not have access, an appropriate error response is returned.&nbsp;&nbsp;

3\. Token Generation:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- Generates a secure token for the user.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- This token serves as a key for the user to access the chat room and perform chat-related actions.&nbsp;&nbsp;

4\. Response:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- Returns a success response along with the generated token.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- Includes additional metadata if required, such as chat room details or token expiration time.&nbsp;&nbsp;

&nbsp;

<SwmSnippet path="/server/src/controller/chat.controller.ts" line="164">

---

connect chat logic

```typescript
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
```

---

</SwmSnippet>

&nbsp;

<SwmSnippet path="/server/src/services/chat/chatServer.service.ts" line="60">

---

use of token in main chat server to verify user

```typescript
    const token = tokenExtractr(req);//this function extract the token from req objcet in starting and verify's it
    
    if(!token){//for some reason , i am feeling that it can lead to vulnerability
      ws.close(4000,"Invalid request,User not have access to this group");
      return;
    }

```

---

</SwmSnippet>

Key Features:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Security: Implements robust middleware for user validation and access control, ensuring only authorized users can                     connect to chat rooms.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Scalability: Supports large-scale environments with multiple colleges and branches by dynamically validating and                       connecting users based on context.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;- Integration: Designed to integrate seamlessly with other APIs in the `Chat` subsystem, ensuring efficient communication             and data consistency.&nbsp;&nbsp;

&nbsp;

Note : Ensure that tokens are securely stored and managed on the frontend to prevent unauthorized access to chat rooms.

&nbsp;

&nbsp;

### **4. GetChat**

Endpoint: `/getchat`

Method: `GET`

This endpoint retrieves the chat room details (room ID and room name) for the authenticated user. It verifies the user's identity using the authentication middleware. Upon successful authentication, the endpoint will return the list of chat rooms the user is connected to or has joined. The data will include the chat room's unique identifier (`_id`) and the room's name (`roomName`).

&nbsp;

#### **Response**:

- **Status 200**: Returns an array of chat rooms with their `id` and `roomName`.

- **Status 401**: If the authentication fails or the user is not authorized, returns an authentication error.

- **Status 404**: If no chat rooms are found for the user, returns a message indicating no chat rooms are available.

### **Workflow**:

1. The request is sent to the `/getchat` endpoint.

2. The **authentication middleware** checks if the user is authenticated by verifying the token.

3. Once verified, the system fetches the chat rooms that the user has joined, using their unique identifier.

4. The response includes the `id` and `roomName` of each chat room.

This endpoint is ideal for returning the chat room data the user has access to and can help in managing the list of active chats for the user in the system.

&nbsp;

<SwmSnippet path="/server/src/controller/chat.controller.ts" line="177">

---

&nbsp;

```typescript
const getChats = AsyncHandler(async (req: Requestany, res: Response) => {//this function helps us to get chatroom and chat data
  const user: user = req.user;
  if (!user.Id) throw new ApiError(400, "user id not provied");
  const ChatDatas = await findChats(user.Id);
  if (!ChatDatas) throw new ApiError(404, "no chat room currently");
  return res.status(200).json(new ApiResponse(200, ChatDatas, "chat rooms found"));
})
```

---

</SwmSnippet>

## **Video API**

&nbsp;

&nbsp;

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBVGVzdGNvcmUlM0ElM0FDT0RFQ1pFUk8=" repo-name="Testcore"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
