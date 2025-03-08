import { Server } from "./Server";

export class ServerBox {
  constructor(socket) {
    this.element = null;
    this.title = "Сервера:";
    this.createServerBtn = null;
    this.listServersElement = null;
    this.serversArr = [];
    this.socket = socket;
  }

  // Отрисовка блока с серверами
  render() {
    this.element = document.createElement("div");
    this.element.className = "box servers-box";
    const html = `
            <div class="header-box">${this.title}</div>
            <div class="content-box">
                <div class="servers-list"></div>
                <div class="server-add">Создать сервер</div>
            </div>`;
    this.element.insertAdjacentHTML("beforeend", html);
    this.createServerBtn = this.element.querySelector(".server-add");
    this.listServersElement = this.element.querySelector(".servers-list");
  }

  // Активация слушателя на добавление сервера
  listener() {
    this.createServerBtn.addEventListener(
      "click",
      this.onCreateServer.bind(this),
    );
  }

  // Получение списка серверов при загрузке страницы
  async getServer() {
    const res = await fetch(process.env.BASE_URL);
    let text = "";
    if (res.ok) {
      for await (const chunk of res.body) {
        text += new TextDecoder().decode(chunk);
      }
    }
    const servers = JSON.parse(text).data;
    if (servers.length) {
      for (const serv of servers) {
        this.createServer(serv.id, serv.state);
      }
    }
  }

  // Обработка нажатия на кнопку создания сервера
  async onCreateServer() {
    const res = await fetch(process.env.BASE_URL, { method: "POST" });
    if (res.ok) {
      console.log("Запрос на подключение сервера успешно отправлен");
    }
  }

  // Метод создания сервера
  createServer(id, status) {
    const server = new Server(id, status, this.socket);
    this.listServersElement.append(server.element);
    this.serversArr.push(server);
    this.listServersElement.scrollTop = this.listServersElement.scrollHeight;
  }

  // Изменение статуса сервера
  changeStatusServer(id, status) {
    const find = this.serversArr.find((el) => el.id === id);
    if (find) {
      find.changeStatus(status);
    }
  }

  // Удаление сервера
  deleteServer(id) {
    let findServer = this.serversArr.find((el) => el.id === id);
    findServer.element.remove();
    this.serversArr = this.serversArr.filter((el) => el !== findServer);
    findServer = null;
  }
}
