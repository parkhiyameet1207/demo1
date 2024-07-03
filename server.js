const express = require("express");
const mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectId;

mongoose.connect("mongodb://localhost:27017/TasksList");
const maintask = require('./FeatchData')
console.log(maintask.maintaskgetdata);
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

app.get('/', async (req, res) => {
  let db = await maintask.maintaskgetdata();
})

const Task = new mongoose.Schema({
  title: String,
  cardId: String,
  parentId: String,
});


const MainTask = mongoose.model('maintask', Task);
const SubtTask = mongoose.model('subtask', Task);


app.post('/api/board/add', async (req, res) => {

  const { cardText, cardId, listId } = req.body;

  let data = new SubtTask({ title: cardText, cardId: cardId, listId: listId });
  await data.save();
  res.send(data);
});

app.post('/api/board/addlist', async (req, res) => {
      const { listId, title } = req.body;
      console.log("req.body  >>>>>>>>>>>> ", req.body);
      let data = new MainTask({ title: title });
      await data.save();
        res.send(data);
});

app.listen(5000);



// Example server-side code (Node.js + Express)

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const List = require('./models/List'); // Your Mongoose List model

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Define routes
// Update a list (PUT request)
// app.put('/api/board/lists/:listId', async (req, res) => {
//   try {
//     const { listId } = req.params;
//     const { title } = req.body;

//     const updatedList = await List.findByIdAndUpdate(
//       listId,
//       { title },
//       { new: true }
//     );

//     res.json(updatedList);
//   } catch (error) {
//     console.error('Error updating list:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Delete a list (DELETE request)
// app.delete('/api/board/lists/:listId', async (req, res) => {
//   try {
//     const { listId } = req.params;

//     await List.findByIdAndDelete(listId);

//     res.json({ message: 'List deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting list:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
