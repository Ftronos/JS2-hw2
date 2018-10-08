"use strict";

function Container(id, className, tagName) {
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

function Gallery(id, className, items) {
    Container.call(this, id, className, 'ul');

    this.items = items;
}

Gallery.prototype = Object.create(Container.prototype);
Gallery.prototype.render = function() {
    var div = document.createElement('div');

    this.items.forEach(function(item) {
        if (item instanceof Container) {
            div.appendChild(item.render());
        }
    });

    return div;
};

function GalleryItem(className, src, href) {
    Container.call(this, null, className, 'li');

    this.href = href;
    this.src = src;
    this.className = className;
}

GalleryItem.prototype = Object.create(Container.prototype);
GalleryItem.prototype.render = function() {
    var a = document.createElement('a');

    a.className = this.className;
    a.href = this.href;

    var link = document.createElement('img');

    link.src = this.href;
    link.textContent = this.title;

    a.appendChild(link);

    return a;
};

window.addEventListener("load", function () {
    // Формируем ajax запрос
    var xhr = new XMLHttpRequest();

    var galleryItems = [];

    xhr.open('POST', 'http://127.0.0.1:8080/menu.json');

    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Парсим json в объекты
                var photos = JSON.parse(xhr.responseText);

                // Проходимся по всем объектам
                photos.forEach(function (item) {
                    var galleryItem = new GalleryItem('photo', item.src, item.href);

                    galleryItems.push(galleryItem);
                });

                console.log(photos);

                var gallery = new Gallery('gallery', 'gallery', galleryItems);

                document.getElementById('wrapper').appendChild(gallery.render());
            }
        }
    }

    // var item1 = new GalleryItem('photo', '/');
    // var item2 = new GalleryItem('photo', '/news');
    // var item3 = new GalleryItem('photo', '/blog');


});