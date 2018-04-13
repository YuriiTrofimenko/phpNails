//Когда документ загрузился в браузер
$(document).ready(function() {

    //
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

    //
    function formatDate(date){

        var pieces = date.split('-');
        pieces.reverse();
        var reversed = pieces.join('-');
        return reversed;
    }

    function formatDateTime(date){

        var pieces = date.split(' ');
        pieces[0] = formatDate(pieces[0]);
        var reversed = pieces.join(' ');
        return reversed;
    }

    $('#calendar').val(new Date().toDateInputValue());

    $('#calendar').change(function() {
      
        populateTable();
    });

    //Отправляем асинхронный запрос на сервер (в файл api/orders.php)
    function populateManicuristsList() {
        $.ajax({
            url: "../api/manicurists.php",
            //method : "POST",
            dataType: 'json',
            type: "POST",
            data: { 
                'action': 'fetch-all-manicurists'
            },
            cache : false
        }).done(function(data) {
            
            //В ответ получаем json-строку с данными о всех заказах
            //и выводим в отладочную консоль браузера
            //console.log(data);

            //Готовим шаблон таблицы заказов при помощи библиотеки Hogan
            //(сейчас дата добавления заказа будет передаваться в него в неотформатированном виде,
            //далее можно форматировать при помощи js)
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

            $('#manicurists-select select').unbind("change");
            //
            $('#manicurists-select select').formSelect();

            $('#manicurists-select select').change(function() {

                //console.log($(this).val());
                populateTimeList();
            });

            //populateTimeList();
        });
    }
    populateManicuristsList();

    //Отправляем асинхронный запрос на сервер (в файл api/orders.php)
    function populateTimeList() {
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
            
            //В ответ получаем json-строку с данными о всех заказах
            //и выводим в отладочную консоль браузера
            //console.log(data);

            //Готовим шаблон таблицы заказов при помощи библиотеки Hogan
            //(сейчас дата добавления заказа будет передаваться в него в неотформатированном виде,
            //далее можно форматировать при помощи js)
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
            //
            $('#time-select select').change(function() {

                $('form#create-order button').removeAttr('disabled');
            });
        });
    }

    //Готовим функцию заполнения таблицы данными о заказах
    function populateTable() {
        $('#table-container').html("<div class='progress'><div class='indeterminate'></div></div>");
    	//Отправляем асинхронный запрос на сервер (в файл api/orders.php)
    	$.ajax({
            url: "../api/orders.php",
            //method : "POST",
            dataType: 'json',
            type: "POST",
            data: { 
		        'action': 'fetch-orders'
                , 'date': $('#calendar').val()
		    },
            cache : false
        }).done(function(data) {
            
            //В ответ получаем json-строку с данными о всех заказах
            //и выводим в отладочную консоль браузера
            //console.log(data);
            $.each(data.orders, function(index, value) {
                
                //data.orders[index].desired_date = formatDate(value.desired_date);
                //formatDateTime
                data.orders[index].created_at = formatDateTime(value.created_at);
            });

            //Готовим шаблон таблицы заказов при помощи библиотеки Hogan
            //(сейчас дата добавления заказа будет передаваться в него в неотформатированном виде,
            //далее можно форматировать при помощи js)
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

            //
            $("table td:contains('забронирован')").parent().addClass("BlueRow");
            $("table td:contains('выполнен')").parent().addClass("GreenRow");
            $("table td:contains('отменен')").parent().addClass("RedRow");

            $("#doneOrder, #cancelOrder, #deleteOrder").attr('disabled', '');

            $("table tr:not(:first)").unbind("click");
            $("table tr:not(:first)").click(function(){

                //console.log($(this));
                $("#doneOrder, #cancelOrder, #deleteOrder").removeAttr('disabled');
                $(this).addClass("selectedTableRow").siblings().removeClass("selectedTableRow");
            });
            //$('#create-order')[0].reset();

            $('#manicurists-select select')
                .find('option')
                .remove();

            $('#time-select select')
                .find('option')
                .remove();

            $('#time-select select').attr('disabled', '');
            $('form#create-order button').attr('disabled', '');

            populateManicuristsList();
            $('#time-select select').formSelect();
        });
    }
    //Вызываем функцию заполнения таблицы данными о заказах
    populateTable();
    //
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

            console.log(data);
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
                
                //Если ответ от сервера получен -
                //выводим его для отладки в консоль браузера
                //console.log(data.result);
                //Проверяем, успешно ли выполнено создание записи о заказе
                if (data.result == 'updated') {
                    
                    populateTable();
                } //Иначе сообщаем об ошибке (далее можно заменить на отображение сообщения в форме)
                else {
                    alert('Ошибка изменения статуса');
                }
            });
        }
    }

    $('#doneOrder').click(function(ev){

        ev.preventDefault();

        updateOrderState(3);
    });

    $('#cancelOrder').click(function(ev){

        ev.preventDefault();

        updateOrderState(1);
    });

    $('#deleteOrder').click(function(ev){

        ev.preventDefault();

        console.log("deleteOrder");
    });
});