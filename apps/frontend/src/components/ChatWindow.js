/* *   💬 File: ChatWindow.js
 *
 *   React component for live chat UI
 *
 *   📥 Listens for messages
 *   ✉️ Sends messages to server
 *   🖊️ Handles editing & deletion
 *   🧠 Uses Redux for global state
 * 
 * 
 * 		🧠 This opens a real-time connection to your Express + Socket.IO server running on port 5000.
 * 				
 * 				const socket = io('http://localhost:5000');
 *
 *		If you're hosting your app, replace with your deployed URL:
 *		const socket = io('https://your-deploy-url.com');
 */

 import React, { useEffect, useState } from 'react';
 import axios from 'axios';
 import './ChatWindow.css';
 import {
   FaTrashAlt,
   FaPencilAlt,
   FaCheck,
   FaTimes,
   FaPaperPlane,
 } from 'react-icons/fa';
 import { useSelector, useDispatch } from 'react-redux';
 import { setUser, logout, setMessages } from '../slices/chatSlice';
 
 const API = 'http://localhost:5000/chats';
 
 export default function ChatWindow() {
   const dispatch = useDispatch();
 
   const currentUser = useSelector((state) => state.chat.currentUser);
   const messages = useSelector((state) => state.chat.messages);
 
   const [text, setText] = useState(''); // Local: message input
   const [username, setUsername] = useState(''); // Local: Login input
 
   const [editingId, setEditingId] = useState(null);
   const [deletingId, setDeletingId] = useState(null);
   const [editText, setEditText] = useState('');
 
   const handleEditKey = (e, id) => {
     if (e.key === 'Enter') {
       updateMessage(id, editText);
     }
     if (e.key === 'Escape') {
       cancelEdit();
     }
   };
 
   const handleInput = (e) => {
     if (e.key === 'Enter') {
       sendMessage();
     }
   };
 
   const cancelEdit = () => {
     setEditingId(null);
     setEditText('');
   };
 
   const fetchMessages = async () => {
     const res = await axios.get(API);
     const allMessages = res.data.messages;
 
     if (!allMessages) {
       dispatch(setMessages([]));
       return;
     }
 
     dispatch(setMessages(allMessages));
   };
 
   const sendMessage = async () => {
     if (!text || !currentUser) {
       return;
     }
 
     const newMessage = { username: currentUser, text };
     await axios.post(API, newMessage);
     setText('');
     fetchMessages();
   };
 
   const deleteMessage = async (id) => {
     setDeletingId(id);
 
     await axios.delete(`${API}/${id}`);
     fetchMessages();
   };
 
   const updateMessage = async (id, newText) => {
     await axios.patch(`${API}/${id}`, {
       text: newText,
     });
     setEditingId(null);
     setEditText('');
     fetchMessages();
   };
 
   useEffect(() => {
     const saved = localStorage.getItem('username');
     if (saved) dispatch(setUser(saved));
     fetchMessages();
   }, []);
 
   return (
     <div id="chat-window">
       <h2>💬 Live Chat 💬</h2>
       {!currentUser && (
         <div className="modal-backdrop">
           <div className="modal-content">
             <h3>Log in to continue</h3>
             <div>
               <input
                 type="text"
                 placeholder="Enter username"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key !== 'Enter') return;
                   localStorage.setItem('username', username);
                   dispatch(setUser(username));
                   setUsername('');
                 }}
                 minLength={5}
                 maxLength={12}
               />
             </div>
             <div className="username-btns">
               <button
                 onClick={() => {
                   if (username.trim()) {
                     localStorage.setItem('username', username);
                     dispatch(setUser(username));
                     setUsername('');
                   }
                 }}
                 style={{
                   padding: "6px 12px",
                   backgroundColor: "#2a9d8f",
                   border: "none",
                   borderRadius: "6px",
                   color: "white",
                   cursor: "pointer",
                 }}
               >
                 Log In
               </button>
               <button
                 onClick={() => {
                   localStorage.setItem('username', 'GUEST101');
                   console.log('username', username)
                   dispatch(setUser('GUEST101'));
                   setUsername('');
                 }}
                 style={{
                   padding: "6px 12px",
                   backgroundColor: "#cf110e",
                   border: "none",
                   borderRadius: "6px",
                   color: "white",
                   cursor: "pointer",
                 }}
               >
                 Continue as guest
               </button>
             </div>
           </div>
         </div>
       )}
 
       {currentUser && (
         <div
           style={{
             marginBottom: "1rem",
             display: "flex",
             alignItems: "center",
             justifyContent: "space-between",
           }}
         >
           <p>
             Welcome, <strong>{currentUser}</strong> 💬
           </p>
           <button
             onClick={() => {
               localStorage.removeItem('username');
               dispatch(setUser(username));
               setUsername('');
             }}
             style={{
               marginLeft: "1rem",
               background: "#e63946",
               border: "none",
               color: "white",
               padding: "6px 12px",
               borderRadius: "6px",
               cursor: "pointer",
             }}
           >
             Log Out
           </button>
         </div>
       )}
 
       <div
         style={{
           height: 400,
           overflowY: "scroll",
           border: "1px solid #ccc",
           padding: 10,
         }}
       >
         {messages.length === 0 ? (
           <div className="no-data-message">
             <strong>No Chat History</strong>
           </div>
         ) : (
           messages.map((message) => (
             <div key={message._id} className="message">
               <span className="span-text">
                 {editingId === message._id ? (
                   <input
                     type="text"
                     value={editText}
                     onChange={(e) => setEditText(e.target.value)}
                     onKeyDown={(e) => handleEditKey(e, message._id)}
                     autoFocus
                   />
                 ) : (
                   <>
                     <strong>{message.username}</strong>: {message.text}
                   </>
                 )}
               </span>
 
               <div className="action-buttons">
                 {editingId === message._id ? (
                   <>
                     <button
                       onClick={() => updateMessage(message._id, editText)}
                       className="edit-button"
                       title="Save"
                     >
                       <FaCheck className="check-icon" />
                     </button>
                     <button
                       className="edit-button"
                       onClick={cancelEdit}
                       title="Cancel"
                     >
                       <FaTimes className="cancel-icon" />
                     </button>
                   </>
                 ) : (
                   <>
                     <button
                       className="edit-button"
                       onClick={() => {
                         setEditingId(message._id);
                         setEditText(message.text);
                       }}
                       title="Edit message"
                     >
                       <FaPencilAlt className="edit-icon" />
                     </button>
                     <button
                       onClick={() => deleteMessage(message._id)}
                       className="trash-button"
                       title="Delete message"
                     >
                       <FaTrashAlt className="trash-icon" />
                     </button>
                   </>
                 )}
               </div>
             </div>
           ))
         )}
       </div>
       <div style={{ marginTop: 10, display: "flex", gap: "0.5rem" }}>
         <input
           style={{
             flexGrow: 1,
             borderRadius: 8,
             paddingLeft: 5,
             paddingRight: 5,
           }}
           placeholder="Message"
           value={text}
           onChange={(e) => setText(e.target.value)}
           onKeyDown={handleInput}
           maxLength={100}
         />
         <button
           onClick={sendMessage}
           className="send-button"
           title="Send message"
         >
           <FaPaperPlane className="send-icon" />
         </button>
       </div>
     </div>
   );
 }