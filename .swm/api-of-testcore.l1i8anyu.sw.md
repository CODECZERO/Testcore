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

<SwmSnippet path="/server/src/controller/chat.controller.ts" line="39">

---

/createChat

```typescript
const joinChatRoom = AsyncHandler(async (req: Requestany, res: Response) => {//using this function a user can join chat
  const roomdata: roomData = req.chatRoomData;//takes data about room
  const user: user = req.user;//takes user id or uder data

  if (!roomdata.roomName || !user.Id) throw new ApiError(400, 'Inviad data provied');//if any of theme is not provided then throw error

  const findChatID = await chatModel.findOne({//find chat Id in chatmodel collection
    roomName: roomdata.roomName,
  });

  if (!findChatID) throw new ApiError(404, 'room not found');

  const joinChat = await User.updateOne({//after finding room it will help user to join the room and update value in database
    sqlId: user.Id
  }, { $addToSet: { chatRoomIDs: findChatID._id } }
  );

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
  }).lean();

  if (!user) throw new ApiError(404, "No user Found");


  const createRoom = await chatModel.create({//making chat room in chatmodel 
    roomName: roomData.roomName,
    AdminId: user?._id,
  });

  if (!(createRoom)) throw new ApiError(500, 'unable to create chat group');

  await cacheUpdateForChatRoom(//updating data in cahce so it's , easly accessed
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
    roomName: roomdata.roomName,
  });

  if (!findChatID) throw new ApiError(404, 'room not found');

  const joinChat = await User.updateOne({//after finding room it will help user to join the room and update value in database
    sqlId: user.Id
  }, { $addToSet: { chatRoomIDs: findChatID._id } }
  );

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
    roomName: roomData.roomName,
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

<SwmSnippet path="server/src/services/chat/chatServer.service.ts" line="60">

---

use of token in main chat server to verify user

```
          ws.roomName = MessageData.roomName;

          clients.add(ws);

          const typeAction = MessageData.typeOfMessage;
          const action = actions[typeAction];
          if (!action) {
            ws.close(4000, "Invalid message type");
            return;
          }

          await action(MessageData, ws);
          
          await receiveMessage(ws);
        } catch (error) {
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

## **User API**

The **User API** is a core component of the system, designed to handle user-specific operations. It is structured into four main sections to address diverse user roles and functionalities efficiently.

---

### **Overview**

The User API is divided into the following parts:

1. **Basic Operations:**\
   Covers general user functionalities such as login, signup, and authentication. These endpoints are shared across all user roles.

2. **Role-Based APIs:**\
   From this point, the API is categorized based on user roles to provide tailored functionalities:

   - **Student API:** Focuses on operations specific to students, such as accessing exams, timetables, and submitting exam results.

   - **College API:** Provides features for college administrators, including managing students, scheduling exams, and tracking results.

   - **Examiner API:** Designed for examiners to manage exam content, distribute tokens, and view exam submissions.

&nbsp;

&nbsp;

### **verifyExamData Middleware**

The `verifyExamData` function is a middleware designed to validate and fetch exam-related data based on user-provided tokens. It ensures that users are authorized and the requested exam data exists before proceeding to the next step in the application flow. This middleware integrates multiple security checks and database lookups to facilitate secure and efficient operations.

---

#### **Functionality Overview**

1. **Purpose:**

   - Verify the validity of a token (ExamToken).

   - Ensure the associated user is valid and exists in the database.

   - Retrieve exam data from the database based on the verified token.

   - Attach the retrieved data to the `req` object for use in subsequent middleware or route handlers.

2. **Key Features:**

   - JWT token verification for secure authentication.

   - MongoDB lookup for mapping short ExamTokens (7-8 characters) to longer unique SQL IDs (32 bytes).

   - Separation of user data and exam data for modular access.

   - Robust error handling to ensure smooth workflow.

---

#### **Implementation Details**

**Input:**

- **Cookies:**

  - `ExamToken`: Short token to identify the exam.

  - `accessToken`: JWT token for user authentication.

- **Body (Optional):**

  - If the `ExamToken` is not found in cookies, it is expected in the request body.

**Steps:**

1. **Token Retrieval and Validation:**

   - Retrieve `ExamToken` and `accessToken` from cookies or request body.

   - Ensure both tokens are provided; throw an error if missing.

   - Use `jsonwebtoken` to decode and verify the `accessToken` using a secret key (`ATS`).

2. **User Validation:**

   - Extract user information (`email`, `role`) from the decoded token.

   - Query the user database (`findOp`) to verify the existence of the user.

3. **Exam Token Mapping:**

   - Use the `ExamToken` to query MongoDB (`searchMongodb`) and retrieve the associated unique exam ID.

4. **Exam Data Retrieval:**

   - Fetch the exam details from the database (`getExam`) using the unique exam ID.

5. **Data Structuring:**

   - Exclude sensitive fields (e.g., `password`) from user data.

   - Attach both user and exam data to `req.examData` for downstream middleware or route handlers.

6. **Error Handling:**

   - Handles missing or invalid tokens, missing database records, and unexpected errors gracefully.

&nbsp;

#### **Example Workflow**

1. **Client Request:**

   - Sends a request with `ExamToken` and `accessToken` in cookies or request body.

2. **Middleware Operations:**

   - **Step 1:** Verify `accessToken` to authenticate the user.

   - **Step 2:** Use `ExamToken` to find the associated exam ID in MongoDB.

   - **Step 3:** Retrieve exam data and user data.

   - **Step 4:** Attach the structured data to the `req` object.

&nbsp;

**Response:**

- If successful, the `req.examData` object will contain:

  ```js
  {
    findTokenInDb: { /* Exam Data */ },
    userData: { /* User Data (excluding password) */ }
  }
  
  ```

&nbsp;

#### **Example Error Cases**

| Error Code | Scenario                                 | Message                         |
| ---------- | ---------------------------------------- | ------------------------------- |
| `400`      | Missing `ExamToken` or `accessToken`.    | `"Token not provided"`          |
| `404`      | `ExamToken` not found in MongoDB.        | `"Exam token not found"`        |
| `404`      | User not found in the database.          | `"User not found"`              |
| `404`      | Exam data not found for the given token. | `"Exam data not found"`         |
| `401`      | Invalid or expired `accessToken`.        | `"Unauthorized: Invalid token"` |

---

#### **Use Case**

- Used in exam-related endpoints where both user authentication and exam-specific data retrieval are required.

- Ensures that only valid and authenticated users can access exam information.

&nbsp;

&nbsp;

## **1)Student Api**

The **Student API** provides endpoints for operations that can be performed by students, such as viewing exam information, accessing timetables, and submitting exams. This API is structured to ensure efficient and secure data access.

---

#### **1. Get Exam Information**

**Endpoint:** `POST /api/v1/student/Exam`

**Description:**\
This endpoint retrieves exam details for a student based on a unique token provided by the examiner. The token allows students to access exam-related information securely.

#### **Request Parameters**

| Parameter | Type   | Required | Description                                                                                           |
| --------- | ------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `token`   | String | Yes      | An 8-character unique token provided by the examiner. This token maps to a 32-byte string in MongoDB. |

#### **How It Works**

1. **Token Mapping:**

   - The 8-character token is mapped to a 32-byte unique identifier stored in a MongoDB NoSQL database.

   - The 32-byte identifier corresponds to the primary key in the SQL database, ensuring seamless cross-database integration.

2. **Search Mechanism:**

   - The API searches the MongoDB collection for the provided token.

   - If the token is found, the associated exam details are fetched from the SQL database using the mapped unique identifier.

---

&nbsp;

#### **Additional Notes**

- **Security:**\
  Tokens are designed to be short (8 characters) for user convenience but are mapped internally to a 32-byte unique identifier in MongoDB to enhance security and reduce the risk of exposure.

- **Database Integration:**

  - MongoDB is used to store token mappings and metadata for faster queries.

  - The SQL database stores detailed exam information linked via the 32-byte unique identifier.

- **Use Case:**\
  This endpoint is particularly useful for examiners to distribute tokens to students. Students can use these tokens to retrieve detailed exam information without exposing sensitive database identifiers.

### **2)**<SwmToken path="/server/src/controller/student.controller.ts" pos="33:2:2" line-data="const giveExam = AsyncHandler(async (req: Requestany, res: Response) =&gt; {//this function saves question data in database">`giveExam`</SwmToken>

#### **PUT /api/v1/student/Exam**

Updates the exam data, such as answers or the question paper, in the database. This endpoint accepts an 8-character token to identify the exam, the student's answer sheet, and the question paper data. The token maps to a 32-byte unique identifier in the database for efficiency and security.

#### **Request**

| Field           | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| `token`         | String | Yes      | An 8-character unique token for the exam.                |
| `answerSheet`   | Object | Yes      | Contains the student's answer sheet details.             |
| `questionPaper` | Object | Yes      | Contains the question paper data provided by the client. |

---

**Headers:**

| Name           | Type   | Required | Description                  |
| -------------- | ------ | -------- | ---------------------------- |
| `Content-Type` | String | Yes      | Should be `application/json` |

```json
Body (JSON):

{
  "token": "ABCDEFGH",
  "answerSheet": {
    "studentId": "123456",
    "answers": [
      {
        "questionId": "Q1",
        "answer": "4"
      },
      {
        "questionId": "Q2",
        "answer": "The Pythagorean theorem states that..."
      }
    ]
  },
  "questionPaper": {
    "title": "Mathematics Final Exam",
    "totalMarks": 100,
    "questions": [
      {
        "id": "Q1",
        "type": "MCQ",
        "content": "What is 2 + 2?",
        "options": ["1", "2", "3", "4"]
      },
      {
        "id": "Q2",
        "type": "Descriptive",
        "content": "Explain the Pythagorean theorem."
      }
    ]
  }
}

```

&nbsp;

### **3)**<SwmToken path="/server/src/controller/student.controller.ts" pos="83:2:2" line-data="const getTimeTable = AsyncHandler(async (req: Requestany, res: Response) =&gt; {//get tiem table from mongodb">`getTimeTable`</SwmToken>

#### **POST /api/v1/student/TimeTable**

Retrieves the exam timetable created by the examiner. This endpoint accepts user-specific data, such as `userId` and `class`, and maps it to the corresponding college and class in the database to locate and return the timetable. The timetable is stored as a nested JSON object in MongoDB.

---

#### **Request**

**Headers:**

| Name           | Type   | Required | Description                   |
| -------------- | ------ | -------- | ----------------------------- |
| `Content-Type` | String | Yes      | Should be `application/json`. |

#### **Workflow**

1. **Input Validation:**

   - The `userId` and `class` are validated to ensure correct format and presence.

2. **Database Lookup:**

   - MongoDB is queried to find the college associated with the provided `userId`.

   - The timetable is mapped to the `college` and `class` combination.

3. **Return Data:**

   - If found, the timetable is returned as a nested JSON object.

---

#### **Additional Notes**

- **User Authentication:** Ensure proper authentication is handled to verify the user requesting the timetable.

- **Data Mapping:**

  - `userId` → College

  - `class` → Class-specific timetable.

- This endpoint assumes the timetable is stored in MongoDB in a structured, nested format mapped to the college and class identifiers.

### **4)**<SwmToken path="/server/src/controller/student.controller.ts" pos="96:2:2" line-data="const getResult = AsyncHandler(async (req: Requestany, res: Response) =&gt; {//get result for student">`getResult`</SwmToken>

#### **POST /api/v1/student/Result**

This endpoint retrieves a student's exam result. It accepts an 8-byte token as input, which is used to identify the associated `questionPaperId`. The `questionPaperId` is then used to locate the corresponding exam result in the database

&nbsp;

#### **Workflow**

1. **Input Validation:**

   - The `token` is validated to ensure it is an 8-byte string.

2. **Database Lookup:**

   - The token is used to fetch the associated `questionPaperId` from MongoDB.

   - The `questionPaperId` is then used to search the SQL or NoSQL database for the student's result.

3. **Return Data:**

   - If found, the result data is returned to the client.

---

#### **Additional Notes**

- **Authentication:** Proper authentication should be implemented to ensure that only authorized users can access this endpoint.

- **Token Mapping:**

  - The 8-byte token is mapped to a 32-byte unique `questionPaperId` in MongoDB for lookup.

- **Result Storage:** The result data should be stored in a structured format to allow efficient retrieval.

&nbsp;

### 5) getQuestionPaperForStundet

#### **POST /api/v1/student/Question**

This endpoint allows students to retrieve the question paper for a specific exam using an 8-byte token. The token is mapped to a unique identifier in the database to locate and fetch the corresponding question paper.

&nbsp;

#### **Workflow**

1. **Input Validation:**

   - The `token` is validated to ensure it is an 8-byte string.

2. **Database Lookup:**

   - The token is used to fetch the associated unique identifier (`questionPaperId`) from MongoDB.

   - The `questionPaperId` is then used to locate the question paper in the database.

3. **Return Data:**

   - If the question paper is found, it is returned to the client in a structured format.

---

#### **Additional Notes**

- **Authentication:** Proper authentication should be implemented to ensure that only authorized students can access this endpoint.

- **Token Mapping:**

  - The 8-byte token is mapped to a 32-byte unique `questionPaperId` in MongoDB for lookup.

- **Question Paper Structure:** Ensure that question paper data is stored in a well-organized format to facilitate efficient retrieval and formatting.

&nbsp;

# Examiner Api

&nbsp;

Endpoint: `/api/v1/examiner/scheduleExam`

\*\*Method:\*\* POST&nbsp;&nbsp;

\*\*Description:\*\* Allows an examiner to schedule an exam for students.&nbsp;

\#### Workflow:

1\. Takes exam data (\`subjectCode\`, `subjectName`, `examName`, `date`, `examStart`, `examEnd`, `examDuration`) from the request body.

2\. Authenticates the user via `Id` and `email`.

3\. Fetches subject details using `subjectCode` and `subjectName`.

4\. Creates a record in the `exam` table in the SQL database.

5\. Generates a unique 8-character token for the exam.

6\. Stores the token and exam ID mapping in a NoSQL database.

7\. Updates the Redis cache with the token and exam ID.

8\. Returns a success response with the `exam` details and `tokenID`.

\#### Output:

\- \*\*Success:\*\*

&nbsp;&nbsp;- HTTP Status: 201

&nbsp;&nbsp;- Body: `{ exam: { Id: <Exam ID> }, tokenID: <Generated Token> }`

\- \*\*Failure:\*\* Appropriate error messages with relevant HTTP status codes.

\---

\### \*\*Endpoint: `/api/v1/examiner/questionPaper`\*\*

\#### \*\*1. Method: GET\*\*

\*\*Description:\*\* Retrieves all question papers associated with a specific exam for the examiner.

\#### Workflow:

1\. Takes `examID` from the request.

2\. Queries the question papers using the `examID`.

3\. Returns the question papers.

\#### Output:

\- \*\*Success:\*\*

&nbsp;&nbsp;- HTTP Status: 200

&nbsp;&nbsp;- Body: `{ data: <Array of Question Papers> }`

\- \*\*Failure:\*\* Appropriate error messages with relevant HTTP status codes.

\#### \*\*2. Method: POST\*\*

\*\*Description:\*\* Creates a question paper for an exam.

\#### Workflow:

1\. Takes `QuestionPaperData` and `examData` from the request.

2\. Inserts the question paper data into the `questionPaper` table in the SQL database.

3\. Returns the created question paper.

\#### Output:

\- \*\*Success:\*\*

&nbsp;&nbsp;- HTTP Status: 201

&nbsp;&nbsp;- Body: `{ data: <Created Question Paper> }`

\- \*\*Failure:\*\* Appropriate error messages with relevant HTTP status codes.

\#### \*\*3. Method: PUT\*\*

\*\*Description:\*\* Updates an existing question paper for an exam.

\#### Workflow:

1\. Takes `examID` and `QuestionPaperData` from the request.

2\. Updates the relevant question paper in the `questionPaper` table.

3\. Returns the updated question paper.

\#### Output:

\- \*\*Success:\*\*

&nbsp;&nbsp;- HTTP Status: 200

&nbsp;&nbsp;- Body: `{ data: <Updated Question Paper> }`

\- \*\*Failure:\*\* Appropriate error messages with relevant HTTP status codes.

\---

\### \*\*Endpoint: `/api/v1/examiner/afterExam`\*\*

\#### \*\*1. Method: GET\*\*

\*\*Description:\*\* Retrieves the total count of students who participated in an exam.

\#### Workflow:

1\. Takes `examID` from the request.

2\. Counts all `questionPaper` records where the `answer` field is not `undefined`.

3\. Returns the count.

\#### Output:

\- \*\*Success:\*\*

&nbsp;&nbsp;- HTTP Status: 200

&nbsp;&nbsp;- Body: `{ count: <Number of Participants> }`

\- \*\*Failure:\*\* Appropriate error messages with relevant HTTP status codes.

\#### \*\*2. Method: PUT\*\*

\*\*Description:\*\* Updates marks for students who participated in an exam.

\#### Workflow:

1\. Takes `QuestionPaperId` and marks-related data from the request.

2\. Updates the `result` table in the SQL database with the provided marks and other data.

3\. Returns the updated result data.

\#### Output:

\- \*\*Success:\*\*

&nbsp;&nbsp;- HTTP Status: 200

&nbsp;&nbsp;- Body: `{ data: <Updated Results> }`

\- \*\*Failure:\*\* Appropriate error messages with relevant HTTP status codes.

\---

\### \*\*Endpoint: `/api/v1/examiner/exam`\*\*

\*\*Method:\*\* GET&nbsp;&nbsp;

\*\*Description:\*\* Retrieves all exams created by an examiner.

\#### Workflow:

1\. Takes `examinerID` from the request.

2\. Queries the `exam` table for exams created by the examiner, including related subject data.

3\. Returns the exams and their details.

\#### Output:

\- \*\*Success:\*\*

&nbsp;&nbsp;- HTTP Status: 200

&nbsp;&nbsp;- Body: `{ examdata: <Array of Exams with Details> }`

\- \*\*Failure:\*\* Appropriate error messages with relevant HTTP status codes.

\---

\### \*\*Endpoint: `/api/v1/examiner/timeTable`\*\*

\*\*Method:\*\* POST&nbsp;&nbsp;

\*\*Description:\*\* Allows an examiner to create a timetable.

\#### Workflow:

1\. Takes `Class`, `Subjects` (nested object), and `CollegeName` from the request.

2\. Inserts the timetable data into the NoSQL database with an `Approve` flag set to `false`.

3\. Returns the created timetable data.

\#### Output:

\- \*\*Success:\*\*

&nbsp;&nbsp;- HTTP Status: 201

&nbsp;&nbsp;- Body: `{ data: <Created Timetable> }`

\- \*\*Failure:\*\* Appropriate error messages with relevant HTTP status codes.

\---

\## Notes:

\- All endpoints handle errors using the `ApiError` class.

\- Success responses are wrapped in the `ApiResponse` format.

&nbsp;

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBVGVzdGNvcmUlM0ElM0FDT0RFQ1pFUk8=" repo-name="Testcore"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
