//Когда документ загрузился в браузер
$(document).ready(function() {
    //Готовим функцию заполнения таблицы данными о заказах
    function populateTable() {
    	//Отправляем асинхронный запрос на сервер (в файл api/orders.php)
    	$.ajax({
            url: "../api/orders.php",
            //method : "POST",
            dataType: 'json',
            type: "POST",
            data: { 
		        'action': 'fetch-all-orders'
		    },
            cache : false
        }).done(function(data) {
            
            //В ответ получаем json-строку с данными о всех заказах
            //и выводим в отладочную консоль браузера
            console.log(data);

            //Готовим шаблон таблицы заказов при помощи библиотеки Hogan
		  	var template = Hogan.compile(
		  		'<table class="table">'
				+  '<thead>'
				+    '<tr>'
				+      '<th>ID</th>'
				+       '<th>name</th>'
                +       '<th>phone</th>'
				+    '</tr>'
				+  '</thead>'
				+  '<tbody>'
	  			+ 		'{{#orders}}'
				+ 			'<tr>'
				+   			'<th scope="row">{{id}}</th>'
				+               '<td>{{name}}</td>'
                +               '<td>{{phone}}</td>'
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