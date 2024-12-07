import react, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';



const BackendUrl = "https://testcore-qmyu.onrender.com";
const userId = localStorage.getItem('userId') || '';
const authToken = localStorage.getItem('accessToken');

const CreateRoom = async (postData: any) => {
    try {
        if (!postData) throw new Error("room name not provided");
        const response = await axios.post(`${BackendUrl}/api/v1/chat/createChat`, postData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            }
        });

        alert("room created");
    } catch (error) {
        throw new Error(`unable to create chat room ${error}`);
    }
}

const CreateChat: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    const HandleForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName) throw new Error(`unable to pass room data to server`);
        console.log(roomName);
        CreateRoom({ roomName });
    }
    return (
        <>

            <form onSubmit={HandleForm}>
                {/* Material UI TextField to capture roomName */}
                <TextField
                    label="Room Name"
                    variant="outlined"
                    value={roomName} // Bind value to the state
                    onChange={(e) => setRoomName(e.target.value)} // Update state when user types
                    required
                    fullWidth
                    sx={{ width: '300px' }} // Set width to 300px
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ width: '300px' , marginTop: '1px',marginRight:'4000px'}} // Set width to 300px

                >
                    Create Chat Room
                </Button>
            </form>
        </>
    );
}

export default CreateChat;