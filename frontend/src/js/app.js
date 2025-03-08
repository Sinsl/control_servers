import { Controller } from "./Controller";

console.log("inretface start");
console.log(process.env.MODE);

const res = await fetch(process.env.BASE_URL + "/ping");

if (res.ok) {
  console.log("backend starting");
  // Создание контроллера
  const container = document.querySelector(".container");
  const controller = new Controller(container);

  // Запуск методов последовательно
  controller.connections();
  controller.initialBox();
  controller.renders();
}
