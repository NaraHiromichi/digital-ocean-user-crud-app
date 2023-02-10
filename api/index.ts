import express, { Request, Response } from "express";
const app = express();
const port = 443;
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.apiUrl);
const apiUrl = process.env.apiUrl;
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
app.get("/api", (req: Request, res: Response) => {
  res.send(html);
});
app.get("/users", (req: Request, res: Response) => {
  res.send({ name: "user1", age: 21 });
});

app.listen(port, () => {
  console.log("running on port 3000");
});
