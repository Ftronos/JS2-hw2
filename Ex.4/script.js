"use strict";

var button = document.getElementById('button');
document.getElementById('check-response').addEventListener("click", function () {
    // Формируем ajax запрос
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:8080/result.json');

    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Парсим json в объекты
                var items = JSON.parse(xhr.responseText);
                // Проходимся по всем объектам
                items.forEach(function (item) {
                    if (item.result === "success") {
                        button.style.backgroundColor = 'green';
                    } else {
                        button.style.backgroundColor = 'red';
                    }
                });
            }
        }
    }
})