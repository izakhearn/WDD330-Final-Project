export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export async function renderWithTemplate(element, data, position = "afterBegin") {
  //Render the template using just javascript with no libraries
  element.innerHTML = data;
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const header = qs("header");
  const footer = qs("footer");
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  //Render Header and Footer
  renderWithTemplate(header, headerTemplate);
  renderWithTemplate(footer, footerTemplate);
  loadMenu();
  highlightMenuItem();
}

export function loadJSON(path) {
  return fetch(path).then((res) => res.json());
}

export async function loadMenu() {
  const menu = document.querySelector(".menu");
  const menuItems = await loadJSON("../json/menu.json");
  for (const item of menuItems) {
    const menuItem = document.createElement("li");
    menuItem.innerHTML = `<a href="${item.url}">${item.name}</a>`;
    menu.appendChild(menuItem);
  }
}

// check which page we are on and highlight the menu item using the class current

export async function highlightMenuItem() {
  const path = window.location.pathname;
  const menuItems = document.querySelectorAll(".menu a");
  for (const item of menuItems) {
    if (path === item.getAttribute("href")) {
      item.classList.add("current");
    } else {
      item.classList.remove("current");
    }
  }
}

export function renderListWithTemplate(templateFn, parentElement, data, position = "afterBegin",clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  if (!data) {
    return;
  }
  const list = data.map((item) => templateFn(item));
  parentElement.insertAdjacentHTML(position, list.join(""));
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key , JSON.stringify(value));
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}