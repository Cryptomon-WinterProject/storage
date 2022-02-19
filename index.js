require("dotenv").config();
var cloudinary = require("cloudinary").v2;
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 8000, () => {
  console.log(`Connected to port ${process.env.PORT || 8000}`);
});

app.get("/", (req, res) => {
  res.send(`Server is up and running`);
});

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/uploadImages", upload.array("photos"), async (req, res) => {
  let images = {};
  let noOfUploads = req.files.length;
  req.files.forEach(async (file, i) => {
    try {
      const result = await cloudinary.uploader.upload(file.path);
      images[`${i}`] = result.url;
      await unlinkAsync(file.path);
    } catch {
      images[`${i}`] = "";
    }
    noOfUploads--;
    if (noOfUploads === 0) {
      res.status(200).send(images);
    }
  });
});
