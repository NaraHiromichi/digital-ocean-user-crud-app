const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const formidable = require("formidable");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;

let users = [
  {
    id: uuidv4(),
    name: "Nara Hiromichi",
    pic: "https://www.wallpaperup.com/uploads/wallpapers/2016/07/16/997105/8b3db39020d66d9caf2378a4958e209c-700.jpg",
  },
];

dotenv.config();
const apiUrl = process.env.apiUrl;
app.use(bodyParser.json());
app.use(express.static("public"));

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="text/javascript">
        localStorage.setItem('apiUrl', '${apiUrl}')
        window.location.href = "/"
    </script>
  </body>
</html>
`;
app.get("/api", (req, res) => {
  res.send(html);
});
app.get("/api/users", (req, res) => {
  res.send(users);
});
app.post("/api/uploadFile", (req, res, next) => {
  const form = formidable({ multiples: false });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ fields, files, users });
    const randomString = uuidv4();
    const fileExtension = files.file["originalFilename"].split(".").pop();
    const oldPath = files.file["filepath"];
    const newPath =
      __dirname + "/../public/images/" + randomString + "." + fileExtension;
    console.log(newPath);
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err;
      res.write("File uploaded and moved!");
      res.end();
    });
    const newUser = {
      id: randomString,
      name: fields.name,
      pic: "./images/" + randomString + "." + fileExtension,
    };
    users.push(newUser);
  });
});

app.delete("/api/deleteUser", (req, res) => {
  const idToDelete = req.body.id;
  const filteredUsers = users.filter((user) => user.id !== idToDelete);
  users = filteredUsers;
  console.log(users);
  // function removeObjectWithId(arr, id) {
  //   const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
  //   arr.splice(objWithIdIndex, 1);
  //   return arr;
  // }
  // removeObjectWithId(users, idToDelete);
  // res.send(JSON.stringify(users));
  res.end();
});

app.listen(port, () => {
  console.log("running on port 3000");
});
