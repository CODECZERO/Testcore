import react from 'react';
import Card from "@mui/material/Card";
import CardContent from"@mui/material/CardContent";
import CardActionArea from"@mui/material/CardActionArea";
import CardActions from"@mui/material/CardActions";
import Typography from"@mui/material/Typography";
import CardMedia from"@mui/material/CardMedia";
import Button from"@mui/material/Button";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import axios from "axios";




const BackendUrl = "https://testcore-qmyu.onrender.com";
const userId = localStorage.getItem('userId') || '';
const authToken = localStorage.getItem('accessToken');

const JoinChatFc=(roomName:string)=>{
    try{
        const College="";//write regex for both of theme
        const Branch="";

        const response=axios.post(`${BackendUrl}/api/v1/chat/ChatQuery/${College}/${Branch}`,{
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        if(!response) throw new Error("Unable to create room");

        return "join room successfuly";
        
    }
    catch(error){
        throw new Error("Error while joing room");
    }
};

const JoinChat: React.FC = () => {
    const RoomsData=useSelector((state:RootState)=>state.Room.RoomState);
    
    return (
    <>
    <Card sx={{
        maxWidth:400,
        minWidth:250,
        maxHeight:400,
        minHeight:250,
    }}>
        <CardActionArea>
            <CardMedia
                component={"image"}
                height={"200"}
                width={"150"}
                image=''
            />
            <CardContent>
                <Typography>
                    {RoomsData?.roomName}
                </Typography>
            </CardContent>
        </CardActionArea>

        <CardActions>
            <Button>
                Join
            </Button>
        </CardActions>

    </Card>
    </>
    );
}

export default JoinChat;