/*
 ***  let messages = [
        { _id: 'abc123', text: 'Hello!', username: 'Neo' },
        { _id: 'xyz789', text: 'Welcome!', username: 'Trinity' }
 ***  ];
*/

// Message will be an instance once invoked
const Message = require('../models/Message');

let dashboard = "";

const showDashboard = (conversation) => {
  console.log("### Chat History ###");
  console.log(conversation);
};

exports.getMessages = async (req, res) => {
  console.log('');
  console.log(' 🔹🔹🔹 Backend Console 🔹🔹🔹 ');
  console.log('-------------------------------');

  console.log("Fetching Chat History...");
  const messages = await Message.find().sort({ timestamp: 1 });

  if (!messages.length) {
    console.log('No data is saved')
    return res.status(200).send('No data is saved');
  }
  messages.forEach((message) => {
    dashboard += `${message.username}: ${message.text}` + "\n";
  });

  showDashboard(dashboard);
  res.json({ messages: messages })
  // result 
  dashboard = "";
};

exports.postMessage = async (req, res) => {
  console.log('');
  console.log(' 🔹🔹🔹 Backend Console 🔹🔹🔹 ');
  console.log('-------------------------------');
  try {
    const { _id, text, username } = req.body;
    const message = new Message({ _id, text, username });
    console.log('message', message)
    await message.save();
    console.log(`Saved a message in Message Data 💾:`);

    // Generate a message dashboard
    console.log("Fetching Chat History...");
    const messages = await Message.find().sort({ timestamp: 1 });
  
    messages.forEach((message) => {
      dashboard += `${message.username}: ${message.text}` + "\n";
    });

    res.status(200).send(dashboard);
    showDashboard(dashboard);
    dashboard = "";
  } catch (error) {
    console.error(error);
  }
};

exports.deleteMessage = async (req, res) => {
  console.log('');
  console.log(' 🔹🔹🔹 Backend Console 🔹🔹🔹 ');
  console.log('-------------------------------');
  try {
    const { id } = req.params;
    console.log('req.params')
    console.log(req.params)
    console.log('id', id)
    const deleted = await Message.deleteOne({ _id: id });

    if (!deleted.deletedCount) {
      return res.status(404).json({ error: 'Could not delete the message' });
    }
    res.json({ messgage: 'Deleted message from Message Data', deleted });
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).send('Could not delete the message')
  }
};

exports.updateMessage = async (req, res) => {
  console.log('');
  console.log(' 🔹🔹🔹 Backend Console 🔹🔹🔹 ');
  console.log('-------------------------------');

  const { id } = req.params;
  const { text } = req.body;

  try {
    const updated = await Message.findOneAndUpdate({ _id: id }, { text }, { new: true, runValidators: true });
    console.log('updated', updated);

    if (!updated) {
      console.log('No update made')
      return res.status(404).json({ error: 'Could not find the message to update' });
    }
    res.json({ messgage: 'Edited message from Message Data' });
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).send('Could not delete the message')
  }
};




// This section is legacy only ---------------------------------------------------------

/*

const data = require("./../db/chats.json");
let messagesArr = data.chats;


exports.getMessages = (req, res) => {
  if (messagesArr.length === 0) {
    res.status(200).send("There is no data");
    return;
  }
  console.log("Fetching Chat History...");
  messagesArr.forEach((message) => {
    dashboard += `${message.username}: ${message.text}` + "\n";
  });
  showDashboard(dashboard);
  res.status(200).send(dashboard);
  dashboard = "";
};

exports.postMessage = (req, res) => {
  try {
    const text = req.body;
    messagesArr.push(text);
    console.log(`Saved Message in Data 💾:`);
    console.log("messagesArr", messagesArr);

    // Generate a message dashboard
    for (const message of messagesArr) {
      console.log("chat.text", message.text);
      dashboard += `${message.username}: ${message.text}` + "\n";
    }
    res.status(200).send(dashboard);
    showDashboard(dashboard);
    dashboard = "";
  } catch (error) {
    console.error(error);
  }
};

exports.deleteMessage = (req, res) => {
  const { _id } = req.params;
  const index = messagesArr.findIndex((message) => message._id === _id);
  try {
    if (index === -1) {
      console.log('Unable to find the message by _id')
      return res.status(404).json({ error: "Message not found" });
    }

    const deleted = messagesArr.splice(index, 1)[0];
    console.log(`Deleted message from messagesArr (${_id})`)
    res.json({ "Server Message": "Deleted", deleted });
  } catch (error) {
    console.error(error);
  }
};

*/