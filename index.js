require("dotenv").config();
var cloudinary = require("cloudinary").v2;
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const app = express();
var cors = require('cors')

app.use(cors())

app.listen(process.env.PORT || 3200, () => {
  console.log("Server Connceted");
});
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload = multer({ dest: "uploads/" });
app.post("/addImages", upload.array("photo"), async (req, res) => {
  let images = {};
  for (let i = 0; i < req.files.length; i++) {
    const result = await cloudinary.uploader.upload(req.files[i].path);
    images[`${i}`] = result.url;
    await unlinkAsync(req.files[i].path);
  }
  res.status(200).send(images);
});
