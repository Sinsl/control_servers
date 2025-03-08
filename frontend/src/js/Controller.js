import { LogBox } from "./components/LogBox";
import { ServerBox } from "./components/ServerBox";

export class Controller {
  constructor(container) {
    this.container = container;
    this.socket = null;
  }

  // Создание экземпляров блоков
  initialBox() {
    this.serverBox = new ServerBox(this.socket);
    this.logBox = new LogBox();
  }

  // Отрисовка элементов блоков
  renders() {
    this.serverBox.render();
    this.container.append(this.serverBox.element);
    this.serverBox.listener();
    this.serverBox.getServer();
    this.logBox.render();
    this.container.append(this.logBox.element);
  }

  // Подключение коннекторов
  connections() {
    const eventSource = new EventSource(process.env.BASE_URL + "/sse");
    eventSource.addEventListener("message", this.eventSEEMsg.bind(this));

    this.socket = new WebSocket(process.env.BASE_SOCKET_URL);
    this.socket.addEventListener("message", this.eventSocketMsg.bind(this));

    this.socket.addEventListener("open", (e) => {
      console.log(e);
    });

    this.socket.addEventListener("close", (e) => {
      console.log(e);
    });
  }

  // Событие, возвращаемое EventSourse
  eventSEEMsg(e) {
    const data = JSON.parse(e.data);
    if (data.info === "Create command") {
      this.serverBox.createServer(data.id, "creating");
    }
    if (data.info === "Created") {
      this.serverBox.changeStatusServer(data.id, "stopped");
    }
    if (data.info === "Removed") {
      this.serverBox.deleteServer(data.id);
    }

    this.logBox.addLog(data);
  }

  // Сообщение, присылаемое сокетом
  eventSocketMsg(e) {
    const dataArr = JSON.parse(e.data);
    if (Array.isArray(dataArr)) {
      if (dataArr.length) {
        for (const data of dataArr) {
          this.serverBox.changeStatusServer(data.id, data.state);
        }
      }
    } else {
      console.log("Socket", dataArr);
    }
  }
}
