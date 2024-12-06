import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatRoomsData {
    _id: string,
    chatData: {
        roomName: string,
        _id: string
    }
}

export interface ChatDataI {
    chatDataState: boolean,
    chatRoomsState: ChatRoomsData[]
}

const initialState: ChatDataI = {
    chatDataState: false,
    chatRoomsState: [],
};

const ChatData = createSlice({
    name: "Chat",
    initialState,
    reducers: {
        addChatData: (state, action: PayloadAction<ChatRoomsData[]>) => {
            state.chatDataState = true;
            state.chatRoomsState = action.payload;
        },

        removeChatData: (state) => {
            state.chatDataState = false;
            state.chatRoomsState = [];
        }
    }
});

export const { addChatData, removeChatData } = ChatData.actions;
export default ChatData.reducer;