"use strict";

function Container(id, className, tagName) {
    if(!['div', 'ul', 'li', 'a'].includes(tagName)) {
        // Ошибка
    }

    this.id = id;
    this.class = className;
    this.tagName = tagName;
}

Container.prototype.render = function() {
    var wrapper = document.createElement(this.tagName);
    wrapper.id = this.id;
    wrapper.className = this.class;

    return wrapper;
};


// Создаём метод удаляющий узел по его классу
Container.prototype.remove = function() {
    var element = document.querySelector(`.${this.className}`);
    element.parentElement.removeChild(element);
};

function Menu(id, className, items) {
    Container.call(this, id, className, 'ul');

    this.items = items;
}

Menu.prototype = Object.create(Container.prototype);
Menu.prototype.render = function() {
    var ul = document.createElement('ul');

    this.items.forEach(function(item) {
        if (item instanceof Container) {
            ul.appendChild(item.render());
        }
    });

    return ul;
};

function MenuItem(className, title, href) {
    Container.call(this, null, className, 'li');

    this.title = title;
    this.href = href;
    this.className = className;
}

MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.render = function() {
    var li = document.createElement('li');

    li.className = this.className;

    var link = document.createElement('a');

    link.href = this.href;
    link.textContent = this.title;

    li.appendChild(link);

    this.internalRender(li);

    return li;
};

MenuItem.prototype.internalRender = function () {

}

function MenuItemWithSubmenu(className, title, href, menu) {
    MenuItem.call(this, className, title, href);

    this.menu = menu;
}

MenuItemWithSubmenu.prototype = Object.create(MenuItem.prototype);
MenuItemWithSubmenu.prototype.internalRender = function (li) {
    li.appendChild(this.menu.render());
};

window.addEventListener("load", function () {
    // Формируем ajax запрос
    var xhr = new XMLHttpRequest();

    var menuItems = new Array();

    xhr.open('POST', 'http://127.0.0.1:8080/menu.json');

    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Парсим json в объекты
                var menus = JSON.parse(xhr.responseText);

                // Проходимся по всем объектам
                menus.forEach(function (item) {
                    console.log(item.title);
                    var menuItem = new MenuItem('item', item.title, item.href);

                    menuItems.push(menuItem);
                });

                var menu = new Menu('menu', 'menu', menuItems);

                document.getElementById('wrapper').appendChild(menu.render());
            }
        }
    }
});