// Built in Moudule
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const PORT = 8000;
const cookieParser = require("cookie-parser");

// User-defined Module
const staticRouter = require("./routes/staticRouter");
const userRouter = require("./routes/user");
const { connectToMongoose } = require("./connect");
const authentication = require("./middleware/auth");
const setUpSocketIO = require("./Web Socket/socket");
const User = require("./models/user");
const Chat = require("./models/chat");
const apiRouter = require("./routes/api");

//Database Connection
connectToMongoose(
  "mongodb+srv://nikhilthakur8012004:sxvrWiUVpW9kv1iY@cluster0.ngblgwi.mongodb.net/Chatify"
);
// App intialisation
const app = express();
const server = http.createServer(app);
// const io = new Server(server);
setUpSocketIO(server);

// Middleware
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(authentication);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Routing
app.use("/", staticRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

const nikhil = express();
nikhil.get("nikhil", (req, res) => {
  res.json("hiii");
});

// Server listening
server.listen(PORT, () =>
  console.log(`Server Started Successfully at Port ${PORT}`)
);
