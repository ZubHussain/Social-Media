const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');
const connectDB = require('./db/db')
const userRouter = require('./routes/userRouter')
const postRouter = require('./routes/postRouter')

const app = express();
app.use(cors(
));
connectDB()


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user',userRouter)
app.use('/post',postRouter)

app.listen(3000, () => {
  console.log('Server running on PORT:3000');
});