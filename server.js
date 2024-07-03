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
  console.log(db);
  // for (let index = 0; index < db.length; index++) {
  //   const element = db[index];
  //   console.log("element", element._id.toString());
  // }
  // let result = await db.find().toArray();
  // res.send(result)
})

const Task = new mongoose.Schema({
  title: String,
  cardId: String,
  parentId: String,
});

// const cardRoutes = require('./routers');
// app.use('/api/board', cardRoutes);
const MainTask = mongoose.model('maintask', Task);
const SubtTask = mongoose.model('subtask', Task);


app.post('/api/board/add', async (req, res) => {

  const { cardText, cardId, listId } = req.body;

  let data = new SubtTask({ title: cardText, cardId: cardId, listId: listId });
  await data.save();
  res.send(data);
});

app.post('/api/board/addlist', async (req, res) => {
  // maintask.maintaskgetdata.aggregate([
  //   {
  //     $lookup:
  //     {
  //       from: "subtasks",
  //       localField: "_id",
  //       foreignField: "cardId",
  //       as: "tasklist"
  //     }
  //   },
  // ]).then((result) => {
    //   console.log("result", result);
    // }).catch((err) => {
      //   console.log(err);
      // });
      const { listId, title } = req.body;
      console.log("req.body  >>>>>>>>>>>>", req.body);
      let data = new MainTask({ title: title });
      await data.save();
        res.send(data);
});



app.delete('/api/board/deletelist/:id', async (req, res) => {
  const { listId, cardId } = req.body;

  let db = await maintask.subtaskgetdata();
  const data = await db.deleteOne({ cardId: req.params._id });
  console.log("data", data);
  res.send(data)

});






app.listen(5000);