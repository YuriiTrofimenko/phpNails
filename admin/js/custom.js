//Когда документ загрузился в браузер
$(document).ready(function() {

    //Добавляем к стандартному типу Дата функцию коррекции даты по часовому поясу
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

    //Форматирование даты, в которой год, месяц и день изначально переставлены местами
    function formatDate(date){

        //Разрезаем строку даты на массив из трех елементов
        var pieces = date.split('-');
        //Меняем элементы местами
        pieces.reverse();
        //Склеиваем строку даты из массива
        var reversed = pieces.join('-');
        return reversed;
    }
    //Форматирование даты со временем
    function formatDateTime(date){

        var pieces = date.split(' ');
        pieces[0] = formatDate(pieces[0]);
        var reversed = pieces.join(' ');
        return reversed;
    }
    //Устанавливаем в элемент ввода Дата (Календарь) текущую дату,
    //вызывая на ней предварительно нашу корректирующую функцию
    $('#calendar').val(new Date().toDateInputValue());
    //Обработчик события изменения даты в элементе Календарь
    $('#calendar').change(function() {
        //Вызов заполнения таблицы расписания
        populateTable();
    });

    //Определение функции для заполнения списка имен мастеров
    function populateManicuristsList() {
        //Отправляем асинхронный запрос на сервер (в файл api/manicurists.php)
        $.ajax({
            url: "../api/manicurists.php",
            dataType: 'json',
            type: "POST",
            data: { 
                'action': 'fetch-all-manicurists'
            },
            cache : false
        }).done(function(data) {
            
            //В ответ получаем json-строку с данными об именах мастеров и их ИД

            //Готовим шаблон списка мастеров при помощи библиотеки Hogan
            var template = Hogan.compile(
                '<select>'
                +'<option disabled="" selected="" value="">Выбор мастера</option>'
                +'{{#manicurists}}'                
                +   '<option value="{{id}}">'
                +       '{{name}}'
                +   '</option>'
                +'{{/manicurists}}'
                +'</select>'
            );
            //Заполняем шаблон данными и помещаем на веб-страницу
            $('#manicurists-select').html(template.render(data));
            //Очищаем список обработчиков события Изменение у выпадающего списка имен мастеров
            $('#manicurists-select select').unbind("change");
            //Активируем выпадающий список имен мастеров (функция, присоединенная библиотекой materialize)
            $('#manicurists-select select').formSelect();
            //Обработчик события выбор имени мастера из списка
            $('#manicurists-select select').change(function() {
                //Вызываем заполнение списка часов приема
                populateTimeList();
            });
        });
    }
    //Вызываем заполнение списка имен мастеров
    populateManicuristsList();

    //Функция для заполнения списка часов приема
    function populateTimeList() {
        //Отправляем на сервер выбранную тип действия, дату и идентификатор выбранного мастера
        $.ajax({
            url: "../api/hours.php",
            //method : "POST",
            dataType: 'json',
            type: "POST",
            data: { 
                'action': 'get-free-hours'
                , 'manicurist-id': $('#manicurists-select select option:selected').val()
                , 'date': $('#calendar').val()
            },
            cache : false
        }).done(function(data) {
            
            //В ответ получаем json-строку с данными о свободных часах приема

            //Готовим шаблон часов приема при помощи библиотеки Hogan
            var template = Hogan.compile(
                '<select>'
                +'<option disabled="" selected="" value="">Выбор времени</option>'
                +'{{#hours}}'                
                +   '<option value="{{id}}">'
                +       '{{hours}}'
                +   '</option>'
                +'{{/hours}}'
                +'</select>'
            );
            //Заполняем шаблон данными и помещаем на веб-страницу
            $('#time-select').html(template.render(data));
            //
            $('#time-select select').formSelect();

            $('#time-select select').unbind("change");
            //Обработчик выбора времени
            $('#time-select select').change(function() {
                //Разблокируем кнопку отправки формы
                $('form#create-order button').removeAttr('disabled');
            });
        });
    }

    //Готовим функцию заполнения таблицы данными о заказах (строками расписания)
    function populateTable() {
        //Добавляем на место таблицы полосу бесконечного прогресса - пока будет ожидаться ответ сервера
        $('#table-container').html("<div class='progress'><div class='indeterminate'></div></div>");
    	//Отправляем асинхронный запрос на сервер (в файл api/orders.php)
        //с указанием действия Получить заказы и выбранной даты
    	$.ajax({
            url: "../api/orders.php",
            dataType: 'json',
            type: "POST",
            data: { 
		        'action': 'fetch-orders'
                , 'date': $('#calendar').val()
		    },
            cache : false
        }).done(function(data) {
            
            //В ответ получаем json-строку с данными о всех заказах
            //для выбранной даты
            $.each(data.orders, function(index, value) {
                
                //Форматируем даты создания записей перед подстановкой в шаблон
                data.orders[index].created_at = formatDateTime(value.created_at);
            });

            //Готовим шаблон таблицы заказов (расписания) при помощи библиотеки Hogan
		  	var template = Hogan.compile(
		  		'<table class="table">'
				+  '<thead>'
				+    '<tr>'
				+      '<th>ID</th>'
				+       '<th>имя</th>'
                +       '<th>телефон</th>'
                +       '<th>желаемое время</th>'
                +       '<th>комментарий</th>'
                +       '<th>мастер</th>'
                +       '<th>статус</th>'
                +       '<th>добавлен</th>'
				+    '</tr>'
				+  '</thead>'
				+  '<tbody>'
	  			+ 		'{{#orders}}'
				+ 			'<tr>'
				+   			'<th scope="row">{{id}}</th>'
				+               '<td>{{name}}</td>'
                +               '<td>{{phone}}</td>'
                +               '<td>{{hours}}</td>'
                +               '<td>{{comment}}</td>'
                +               '<td>{{manicurist_name}}</td>'
                +               '<td>{{status}}</td>'
                +               '<td>{{created_at}}</td>'
                +            '</tr>'
	      		+        '{{/orders}}'
                +	'</tbody>'
				+ '</table>'
	  		);
		  	//Заполняем шаблон данными и помещаем на веб-страницу
	  		$('#table-container').html(template.render(data));

            //Расцветка для разных состояний заказа, классы цветов определены в файле стилей
            $("table td:contains('забронирован')").parent().addClass("BlueRow");
            $("table td:contains('выполнен')").parent().addClass("GreenRow");
            //$("table td:contains('отменен')").parent().addClass("RedRow");
            //Блокируем кнопки работы со строками таблицы, пока не будет выбрана строка
            $("#doneOrder, #cancelOrder, #deleteOrder").attr('disabled', '');
            //Устанавливаем обработчик кликов на все строки таблицы кроме заголовка
            $("table tr:not(:first)").unbind("click");
            $("table tr:not(:first)").click(function(){

                //Разблокируем кнопки, когда выбрана строка таблицы
                $("#doneOrder, #cancelOrder, #deleteOrder").removeAttr('disabled');
                //Отмечаем текст выбранной строки зеленым цветом, с остальных строк выделение убираем
                //(оно могло быть ранее установлено на одну из строк)
                $(this).addClass("selectedTableRow").siblings().removeClass("selectedTableRow");
            });
            //Очищаем списки в форме
            $('#manicurists-select select')
                .find('option')
                .remove();

            $('#time-select select')
                .find('option')
                .remove();
            //Отключаем элементы ввода в форме
            $('#time-select select').attr('disabled', '');
            $('form#create-order button').attr('disabled', '');
            //Заполняем список выбора мастеров
            populateManicuristsList();
            //Активируем список выбора времени
            $('#time-select select').formSelect();
        });
    }
    //Вызываем функцию заполнения таблицы данными о заказах
    populateTable();
    //Обработчик добавления строки в расписание
    $('form#create-order button').click(function(ev){

        ev.preventDefault();

        $.ajax({
            url: "../api/orders.php",
            //method : "POST",
            dataType: 'json',
            type: "POST",
            data: { 
                'action': 'create-order'
                , 'date': $('#calendar').val()
                , 'hours-id': $('#time-select select option:selected').val()
                , 'manicurist-id': $('#manicurists-select select option:selected').val()
            },
            cache : false
        }).done(function(data) {

            //console.log(data);
            //Проверяем, успешно ли выполнено создание записи о заказе
            if (data.result == 'created') {
                //Сообщаем пользователю об успешной отправке (далее можно заменить на отображение сообщения в форме)
                //alert('Заказ успешно добавлен');
                populateTable();
            } //Иначе сообщаем об ошибке (далее можно заменить на отображение сообщения в форме)
            else {
                alert('Ошибка добавления заказа');
            }
        });
    });
    //Функция обновления статуса строки в расписании
    function updateOrderState(statusId){

        if ($('.selectedTableRow').find('th').length === 0) {

            alert('Сначала выберите одну строку в таблице');
        } else {

            //console.log($('.selectedTableRow').find('th').text());
            var orderId = $('.selectedTableRow').find('th').text();

            $.ajax({
                url: "../api/orders.php",
                //method : "post",
                type: "POST",
                dataType: 'json',
                //data: serializedData,
                data: { 
                    'action': 'update-order-status'
                    , 'order-id' : orderId
                    , 'status-id': statusId
                },
                cache : false
            }).done(function(data) {

                //Проверяем, успешно ли выполнено обновление
                if (data.result == 'updated') {
                    //Заполняем таблицу
                    populateTable();
                } //Иначе сообщаем об ошибке (далее можно заменить на отображение сообщения в форме)
                else {
                    alert('Ошибка изменения статуса');
                }
            });
        }
    }
    //Обработчик кнопки Выполнен
    $('#doneOrder').click(function(ev){

        ev.preventDefault();

        updateOrderState(3);
    });
    //Обработчик кнопки Отменить
    $('#cancelOrder').click(function(ev){

        ev.preventDefault();

        updateOrderState(1);
    });
    //Обработчик кнопки Удалить
    $('#deleteOrder').click(function(ev){

        ev.preventDefault();
        var orderId = $('.selectedTableRow').find('th').text();
        $.ajax({
            url: "../api/orders.php",
            dataType: 'json',
            type: "POST",
            data: { 
                'action': 'delete-order'
                , 'order-id' : orderId
            },
            cache : false
        }).done(function(data) {

            //Проверяем, успешно ли выполнено удаление записи о заказе
            if (data.result == 'deleted') {
                populateTable();
            } //Иначе сообщаем об ошибке (далее можно заменить на отображение сообщения в форме)
            else {
                alert('Ошибка удаления заказа');
            }
        });
    });
});