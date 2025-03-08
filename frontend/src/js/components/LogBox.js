export class LogBox {
  constructor() {
    this.element = null;
    this.title = "Логи";
    this.contentBox = null;
  }

  // Отрисовка блока с логами
  render() {
    this.element = document.createElement("div");
    this.element.className = "box log-box";
    const html = `
        <div class="header-box">${this.title}:</div>
        <div class="content-box"></div>`;
    this.element.insertAdjacentHTML("beforeend", html);
    this.contentBox = this.element.querySelector(".content-box");
  }

  // Подготовка верстки для вставки
  createLogHTML(timeStamp, id, event) {
    const dateObj = new Date(timeStamp);
    const date =
      dateObj.toLocaleTimeString() + " " + dateObj.toLocaleDateString();
    const html = `
        <div class="log-item">
            <div class="log-date">${date}</div>
            <div class="log-server-id">Server: <span>${id}</span></div>
            <div class="log-info">INFO: <span>${event}</span></div>
        </div>`;
    return html;
  }

  // Вставка одного лога
  addLog(msg) {
    const html = this.createLogHTML(msg.timeStamp, msg.id, msg.info);
    this.contentBox.insertAdjacentHTML("beforeend", html);
    this.contentBox.scrollTop = this.contentBox.scrollHeight;
  }
}
