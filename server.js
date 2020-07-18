"use strict";
var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
var fs = require("fs");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.post("/uploads", (req, res) => {
  try {
    if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const file = req.files.file;
    const user = req.body.user;
    const url = `${__dirname}/client/public/uploads/${user}/`;

    if (!fs.existsSync(url)) {
      fs.mkdirSync(url);
    }

    file.mv(`${url + file.name}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json({
        fileName: file.name,
        filePath: `/uploads/${user}/${file.name}`,
      });
    });
  } catch (err) {
    res.json({ msg: "File with that name exist" });
  }
});

//Serve static assets if in production

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));

  app.get('*', (req, res)=> {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));