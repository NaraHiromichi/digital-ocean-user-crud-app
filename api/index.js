const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const formidable = require("formidable-serverless");
const { v4: uuidv4 } = require("uuid");
const app = express();
const aws = require("aws-sdk");
const s3 = new aws.S3({
  endpoint: "sgp1.digitaloceanspaces.com",
  accessKeyId: "DO00AGWGBAWFVGJKUVTX",
  secretAccessKey: "83ckcc4GSag+spdD345p1kZ//5rCY0DWk9OZJ4AE03U",
});
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
  const randomString = uuidv4();
  const form = new formidable.IncomingForm();
  form.uploadDir = "./";
  form.keepExtensions = true;
  let newUser = {};
  form.parse(req, async (err, fields, files) => {
    if (err) return res.send(err); // Read file
    const file = fs.readFileSync(files.file.path);
    newUser = {
      id: randomString,
      name: fields.name,
    };
    s3.upload(
      {
        Bucket: "msquarefdc", // Add bucket name here
        ACL: "public-read", // Specify whether anyone with link can access the file
        Key: `${randomString}/${files.file.name}`, // Specify folder and file name
        Body: file,
      },
      {
        partSize: 10 * 1024 * 1024,
        queueSize: 10,
      }
    ).send((err, data) => {
      if (err) return res.status(500); // Unlink file
      fs.unlinkSync(files.file.path); // Return file url or other necessary details
      newUser = {
        ...newUser,
        pic: data.Location,
      };
      users.push(newUser);
      return res.send({
        url: data.Location,
      });
    });
  });
});

app.delete("/api/deleteUser", (req, res) => {
  const idToDelete = req.body.id;
  const filteredUsers = users.filter((user) => user.id !== idToDelete);
  users = filteredUsers;
  res.end();
});

app.listen(port, () => {
  console.log("running on port 3000");
});
