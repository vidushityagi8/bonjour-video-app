// require statements
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const bodyParser = require("body-parser");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const { v4: uuidV4 } = require("uuid");

// app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ------------VIEWS----------

// home
app.get("/", (req, res) => {
  const roomId = uuidV4();
  res.render("homePage", { roomId });
  // res.render('details')
});
app.post("/", (req, res) => {
  let roomId = req.body.roomId;
  const userName = req.body.userName;
  if (roomId == "") {
    roomId = uuidV4();
  }

  console.log(`Room id: ${roomId}`);
  console.log(userName);

  const data = {
    roomId: roomId,
    userName: userName,
  };

  console.log(data);

  res.render("callPage", { obj: data });
});

app.get("/about", (req, res) => {
  res.render("aboutPage");
});

// ----------- socket io connection -------------
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });

    socket.on("send-message", (data) => {
      socket.broadcast.to(data.roomId).emit("receive-message", {
        message: data.message,
        userName: data.userName,
      });
    });

    socket.on("name-tag-added", (data) => {
      socket.broadcast.to(data.roomId).emit("user-name-tag-added", {
        userId: data.userId,
        iconClass: data.iconClass,
      });
    });

    socket.on("name-tag-removed", (data) => {
      socket.broadcast.to(data.roomId).emit("user-name-tag-removed", {
        userId: data.userId,
        iconClass: data.iconClass,
      });
    });
  });
});

server.listen(process.env.PORT || 3000);
