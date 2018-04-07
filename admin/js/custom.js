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
            console.log(data);

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
        });
    }
    //Вызываем функцию заполнения таблицы данными о заказах
    populateTable();
});