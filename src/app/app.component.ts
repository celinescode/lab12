import { Component } from "@angular/core";
import * as io from "socket.io-client";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  messageText: string;
  name: string;
  messages: Array<any> = [];
  socket: SocketIOClient.Socket;
  clientId="";
  constructor() {
    this.socket = io.connect();
  }
  ngOnInit() {
    this.messages = new Array();
    this.listen2Events();
  }
  listen2Events() {
    this.socket.on("msg", data => {
      // var nameObj = {name: this.name}
      // var fullData = {...data,...nameObj}
      this.messages.push(data);
      this.clientId = data.clientid;
    });
  }

  sendMessage() {
    this.socket.emit("newMsg", {aMessage: this.messageText, aName: this.name});
    this.messageText = "";
  }

  loadNewContent(){
    let player=<HTMLAudioElement>document.getElementById("player");
    player.src = this.clientId + ".mp3?time=" + new Date().getTime;
    player.load;
  }
}