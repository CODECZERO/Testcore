// import react from 'react';
// import Card from "@mui/material/Card";
// import CardContent from"@mui/material/CardContent";
// import CardActionArea from"@mui/material/CardActionArea";
// import CardActions from"@mui/material/CardActions";
// import Typography from"@mui/material/Typography";
// import CardMedia from"@mui/material/CardMedia";
// import Button from"@mui/material/Button";
// import {useSelector} from "react-redux";
// import {RootState} from "../store";
// import axios from "axios";




// const BackendUrl = "https://testcore-qmyu.onrender.com";
// const userId = localStorage.getItem('userId') || '';
// const authToken = localStorage.getItem('accessToken');

// const JoinChatFc=(roomName:string)=>{
//     try{
//         const College="";//write regex for both of theme
//         const Branch="";

//         const response=axios.post(`${BackendUrl}/api/v1/chat/ChatQuery/${College}/${Branch}`,{
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//             }
//         });
//         if(!response) throw new Error("Unable to create room");

//         return "join room successfuly";
        
//     }
//     catch(error){
//         throw new Error("Error while joing room");
//     }
// };

// const JoinChat: React.FC = () => {
//     const RoomsData=useSelector((state:RootState)=>state.Room.RoomState);
    
//     return (
//     <>
//     <Card sx={{
//         maxWidth:400,
//         minWidth:250,
//         maxHeight:400,
//         minHeight:250,
//     }}>
//         <CardActionArea>
//             <CardMedia
//                 component={"image"}
//                 height={"200"}
//                 width={"150"}
//                 image=''
//             />
//             <CardContent>
//                 <Typography>
//                     {RoomsData?.roomName}
//                 </Typography>
//             </CardContent>
//         </CardActionArea>

//         <CardActions>
//             <Button>
//                 Join
//             </Button>
//         </CardActions>

//     </Card>
//     </>
//     );
// }

// export default JoinChat;

import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";

const BackendUrl = "https://testcore-qmyu.onrender.com";
const authToken = localStorage.getItem("accessToken"); // Retrieve the access token from localStorage

// Function to handle joining a chat room
const JoinChatFc = async (roomName: string) => {
    try {
        if (!roomName) throw new Error("Room name (college/branch) is required");

        const response = await axios.post(
            `${BackendUrl}/api/v1/chat/ChatQuery/${roomName}`, // Room name in format college/branch
            {}, // No additional data in the body for now
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Attach Authorization header
                },
            }
        );

        if (!response) throw new Error("Unable to join the room");

        return response.data.message || "Joined room successfully";
    } catch (error: any) {
        console.error("Error while joining room:", error.message);
        throw new Error(error.response?.data?.message || "Error while joining room");
    }
};

// React component for Join Chat
const JoinChat: React.FC = () => {
    const [college, setCollege] = useState("");
    const [branch, setBranch] = useState("");
    const [feedback, setFeedback] = useState("");

    // Handle form submission
    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const roomName = `${college}/${branch}`; // Format roomName as college/branch
            const result = await JoinChatFc(roomName);
            setFeedback(result); // Set success feedback
        } catch (error: any) {
            setFeedback(error.message); // Set error feedback
        }
    };

    return (
        <div>
            <form onSubmit={handleJoin}>
                {/* Input for College */}
                <TextField
                    label="College"
                    variant="outlined"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />

                {/* Input for Branch */}
                <TextField
                    label="Branch"
                    variant="outlined"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ width: "300px" }}
                >
                    Join Chat Room
                </Button>
            </form>

            {/* Feedback Section */}
            {feedback && <p>{feedback}</p>}
        </div>
    );
};

export default JoinChat;
