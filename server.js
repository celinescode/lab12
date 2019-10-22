let express = require("express");
let path = require("path");
let app = express();
let server = require("http").Server(app);

const fs = require("fs");
// Imports the Google Cloud client library
const textToSpeech = require("@google-cloud/text-to-speech");

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

let io = require("socket.io")(server);

let port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/chatApp")));
app.use("/", express.static(path.join(__dirname, "mp3")));

io.on("connection", socket => {
  console.log("new connection made from client with ID="+socket.id);

  socket.on("newMsg", data => {

    //send io sockets back to client
    io.sockets.emit("msg", { msg: data.aMessage, name:data.aName, timeStamp: getCurrentDate(), clientid: socket.id });

    //convert to speech by using google cloud service
    const text = data.aMessage;

    //construct the request
    const request = {
      input: { text: text },
      // Select the language and SSML Voice Gender (optional)
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      // Select the type of audio encoding
      audioConfig: { audioEncoding: "MP3" },
    };
    
    // Performs the Text-to-Speech request
    client.synthesizeSpeech(request, (err, response) => {
      if (err) {
        console.error("ERROR:", err);
        return;
      }
    
      // Write the binary audio content to a local file
      fs.writeFile("mp3/" + socket.id + ".mp3", response.audioContent, "binary", err => {
        if (err) {
          console.error("ERROR:", err);
          return;
        }
        console.log("Audio content written to file: output.mp3");
      });
    });
  });
});



server.listen(port, () => {
  console.log("Listening on port " + port);
});

function getCurrentDate() {
  let d = new Date();
  return d.toLocaleString();
}