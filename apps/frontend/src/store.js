import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';

// Today I will learn how to use React-redux, the state management tool.

export const store = configureStore({
    reducer: {
        chat: chatReducer
    }
});