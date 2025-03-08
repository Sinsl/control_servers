import { Controller } from "./Controller";

console.log("inretface start");
console.log(process.env.MODE);

const container = document.querySelector(".container");

const msg = document.createElement("div");
if (process.env.MODE === "production") {
  msg.className = "msg-start";
  msg.insertAdjacentHTML(
    "beforeend",
    `<p>Сервер на Render запускается</p>
    <p>Дождитесь завершения</p>`,
  );
  container.append(msg);
}

const res = await fetch(process.env.BASE_URL + "/ping");

if (res.ok) {
  console.log("backend starting");
  msg.remove();
  // Создание контроллера
  const controller = new Controller(container);

  // Запуск методов последовательно
  controller.connections();
  controller.initialBox();
  controller.renders();
}
