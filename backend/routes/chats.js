const express = require('express');
const router = express.Router();

const { getMessages, postMessage, deleteMessage, updateMessage  } = require('../controllers/chatsController');

router.get('/', getMessages);
router.post('/', postMessage);
router.delete('/:id', deleteMessage);
router.patch('/:id', updateMessage)


module.exports = router;