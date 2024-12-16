

// import React, { useState } from "react";
// import axios from "axios";
// import { TextField, Button } from "@mui/material";

// const BackendUrl = "https://testcore-qmyu.onrender.com";
// const authToken = localStorage.getItem("accessToken"); // Retrieve the access token from localStorage



// // Function to handle joining a chat room
// const JoinChatFc = async (roomName: string) => {
//     try {
//         if (!roomName) throw new Error("Room name (college/branch) is required");

//         const response = await axios.post(
//             `${BackendUrl}/api/v1/chat/ChatQuery/${roomName}`, // Room name in format college/branch
//             {}, // No additional data in the body for now
//             {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`, // Attach Authorization header
//                 },
//             }
//         );
//         console.log(roomName)

//         if (!response) throw new Error("Unable to join the room");

//         return response.data.message || "Joined room successfully";
//     } catch (error: any) {
//         console.error("Error while joining room:", error.message);
//         throw new Error(error.response?.data?.message || "Error while joining room");
//     }
// };

// // React component for Join Chat
// const JoinChat: React.FC = () => {
//     const [college, setCollege] = useState("");
//     const [branch, setBranch] = useState("");
//     const [feedback, setFeedback] = useState("");
    
    
//     // Handle form submission
//     const handleJoin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const roomName = `${college}/${branch}`; // Format roomName as college/branch
//             const result = await JoinChatFc(roomName);
            
//             console.log("Room Name : ",roomName)
//             setFeedback(result); // Set success feedback
//         } catch (error: any) {
//             setFeedback(error.message); // Set error feedback
//         }
//     };
//     return (
//         <div>
//             <form onSubmit={handleJoin}>
//                 {/* Input for College */}
//                 <TextField
//                     label="College"
//                     variant="outlined"
//                     value={college}
//                     onChange={(e) => setCollege(e.target.value)}
//                     required
//                     fullWidth
//                     margin="normal"
//                 />

//                 {/* Input for Branch */}
//                 <TextField
//                     label="Branch"
//                     variant="outlined"
//                     value={branch}
//                     onChange={(e) => setBranch(e.target.value)}
//                     required
//                     fullWidth
//                     margin="normal"
//                 />

//                 {/* Submit Button */}
//                 <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     sx={{ width: "300px" }}
//                 >
//                     Join Chat Room
//                 </Button>
//             </form>

//             {/* Feedback Section */}
//             {feedback && <p>{feedback}</p>}
//         </div>
//     );
// };

// export default JoinChat;


import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";

const BackendUrl = "https://testcore-qmyu.onrender.com";
const authToken = localStorage.getItem("accessToken");

interface JoinChatProps {
  onRoomJoin: (roomName: string) => void; // Callback to notify parent of the joined room
}

const JoinChat: React.FC<JoinChatProps> = ({ onRoomJoin }) => {
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roomName = `${college}/${branch}`;
      const response = await axios.post(
        `${BackendUrl}/api/v1/chat/ChatQuery/${roomName}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      localStorage.setItem("roomName", roomName); // Update localStorage
      onRoomJoin(roomName); // Notify parent component immediately
      setFeedback(response.data.message || "Joined room successfully");
    } catch (error: any) {
      setFeedback(error.response?.data?.message || "Error while joining room");
    }
  };

  return (
    <div>
      <form onSubmit={handleJoin}>
        <TextField
          label="College"
          variant="outlined"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Branch"
          variant="outlined"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Join Chat Room
        </Button>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default JoinChat;
