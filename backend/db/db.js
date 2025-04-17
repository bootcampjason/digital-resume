const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chat-app', {})
.then(() => console.log('✅ Connected to local MongoDB'))
.catch(err => console.error('❌ DB connection error:', err));