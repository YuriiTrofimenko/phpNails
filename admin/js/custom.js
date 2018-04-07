//Когда документ загрузился в браузер
$(document).ready(function() {

    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

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
                +       '<th>желаемая дата</th>'
                +       '<th>желаемое время</th>'
                +       '<th>комментарий</th>'
                +       '<th>добавлен</th>'
				+    '</tr>'
				+  '</thead>'
				+  '<tbody>'
	  			+ 		'{{#orders}}'
				+ 			'<tr>'
				+   			'<th scope="row">{{id}}</th>'
				+               '<td>{{name}}</td>'
                +               '<td>{{phone}}</td>'
                +               '<td>{{desired_date}}</td>'
                +               '<td>{{desired_time}}</td>'
                +               '<td>{{comment}}</td>'
                +               '<td>{{created_at}}</td>'
                +            '</tr>'
	      		+        '{{/orders}}'
                +	'</tbody>'
				+ '</table>'
	  		);
		  	//Заполняем шаблон данными и помещаем на веб-страницу
	  		$('#table-container').html(template.render(data));

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
});