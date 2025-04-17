/* *   🧠 Redux Slice: chatSlice.js
   *   
   *   Centralized state for user + messages
   * 
   *   📥 Listens for messages
   *   ✉️ Sends messages to server
   *   🖊️ Handles editing & deletion
   *   🧠 Uses Redux for global state
*/

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    messages: []
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload;
        },
        logout(state) {
            state.currentUser = null;
        },
        setMessages(state, action) {
            state.messages = action.payload;
        },
        // addMessage(state, action) {
        //     state.messages.push(action.payload);
        // }
    }
});

export const { setUser, logout, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;