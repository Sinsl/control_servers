export class Server {
  constructor(id, status, socket) {
    this.element = null;
    this.socket = socket;
    this.id = id;
    this.status = status;
    this.statusRound = null;
    this.statusText = null;
    this.btnChange = null;
    this.btnDelete = null;
    this.onChangeStatusEl = this.onChangeStatus.bind(this);
    this.onDeleteEl = this.onDelete.bind(this);
    this.render();
    this.listener();
  }

  // Отрисовка одного сервера при создании экземпляра
  render() {
    this.element = document.createElement("div");
    this.element.className = "server-item";
    const html = `<div class="item-id" data-id="${this.id}">${this.id}</div>
                <div class="item-statuses">
                    <div class="status-title">Status:</div>
                    <div class="status-round ${this.status}"></div>
                    <div class="status-text">${this.status}</div>
                </div>
                <div class="item-ations">
                    <div class="action-title">Actions:</div>
                    <div class="action-btn">
                        <span class="material-symbols-outlined btn-actions">
                            ${this.status === "running" ? "pause" : "play_arrow"}
                        </span>
                        <span class="material-symbols-outlined btn-actions">
                            close
                        </span>
                    </div>
                </div>
        `;

    this.element.insertAdjacentHTML("beforeend", html);
    this.statusRound = this.element.querySelector(".status-round");
    this.statusText = this.element.querySelector(".status-text");
    const btns = this.element.querySelectorAll(".btn-actions");
    this.btnChange = btns[0];
    this.btnDelete = btns[1];
  }

  // Установка слушателей на кнопки
  listener() {
    this.btnChange.addEventListener("click", this.onChangeStatusEl);
    this.btnDelete.addEventListener("click", this.onDeleteEl);
  }

  // Обработка нажатия на кнопку изменения статуса
  onChangeStatus() {
    this.socket.send(JSON.stringify({ id: this.id }));
  }

  // Метод изменения статуса
  changeStatus(status) {
    this.status = status;
    this.statusRound.className = `status-round ${status}`;
    this.statusText.textContent = status;
    const textBtn = status === "running" ? "pause" : "play_arrow";
    this.btnChange.textContent = textBtn;
  }

  // Обработка нажатия на кнопку удаления
  async onDelete() {
    const res = await fetch(process.env.BASE_URL + "/" + this.id, {
      method: "DELETE",
    });
    if (res.ok) {
      console.log("Запрос на удаление сервера успешно отправлен");
      this.btnChange = removeEventListener("click", this.onChangeStatusEl);
      this.btnDelete = removeEventListener("click", this.onDeleteEl);
    }
  }
}
