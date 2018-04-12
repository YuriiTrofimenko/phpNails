$(document).ready(function () {

    //
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

    $('#calendar').val(new Date().toDateInputValue());

    var minDate = new Date();
    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    $('#calendar').attr({
       "min" : minDate.toDateInputValue(),
       "max" : maxDate.toDateInputValue()
    });

    $('#calendar').change(function() {
      
        populateManicuristsList();
    });

    //Отправляем асинхронный запрос на сервер (в файл api/orders.php)
    function populateManicuristsList() {
        $.ajax({
            url: "api/manicurists.php",
            //method : "POST",
            dataType: 'json',
            type: "POST",
            data: { 
                'action': 'fetch-available-manicurists'
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
                '<option disabled="" selected="" value="">Выбор мастера</option>'
                +'{{#manicurists}}'                
                +   '<option value="{{id}}">'
                +       '{{name}}'
                +   '</option>'
                +'{{/manicurists}}'
            );
            //Заполняем шаблон данными и помещаем на веб-страницу
            $('#manicurists-select select').html(template.render(data));

            $('#manicurists-select select').removeAttr('disabled');

            $('#manicurists-select select').unbind("change");
            //
            $('#manicurists-select select').change(function() {

                //console.log($(this).val());
                $('#time-select select').removeAttr('disabled');
                populateTimeList();
            });

            //populateTimeList();
        });
    }
    populateManicuristsList();

    //Отправляем асинхронный запрос на сервер (в файл api/orders.php)
    function populateTimeList() {
        $.ajax({
            url: "api/hours.php",
            //method : "POST",
            dataType: 'json',
            type: "POST",
            data: { 
                'action': 'get-available-hours'
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
                '<option disabled="" selected="" value="">Выбор времени</option>'
                +'{{#hours}}'                
                +   '<option value="{{id}}">'
                +       '{{hours}}'
                +   '</option>'
                +'{{/hours}}'
            );
            //Заполняем шаблон данными и помещаем на веб-страницу
            $('#time-select select').html(template.render(data));
            //
            $('#time-select select').unbind("change");
            //
            $('#time-select select').change(function() {

                $('form#create-order button').removeAttr('disabled');
            });
        });
    }

    //Обработчик события "отправка формы заказа"
    $('#create-order').submit(function (ev) {

        //Предотвращение отправки формы
        ev.preventDefault();

        // Находим форму отправки заказа на странице
        var $form = $(this);

        //Получаем значения из полей ввода формы
        var $inputs = $form.find("input, select, button, textarea");

        //Подготавливаем данные к отправке
        //var serializedData = $form.serialize();

        //Отключаем поля ввода формы на время отправки запроса
        $inputs.prop("disabled", true);

        //Отправка асинхронного запроса на сохранение данных в БД
        $.ajax({
            url: "api/orders.php",
            //method : "post",
            type: "POST",
            dataType: 'json',
            //data: serializedData,
            data: { 
                'action': 'book-order'
                , 'date': $('#calendar').val()
                , 'manicurist-id': $('#manicurists-select select option:selected').val()
                , 'hours-id': $('#time-select select option:selected').val()
                , 'user-name': $('#user-name').val()
                , 'user-phone': $('#user-phone').val()
                , 'comment': $('#comment').val()
            },
            cache : false
        }).done(function(data) {
            
            //Если ответ от сервера получен -
            //выводим его для отладки в консоль браузера
            console.log(data.result);
            //Проверяем, успешно ли выполнено создание записи о заказе
            if (data.result == 'booked') {
                //Сообщаем пользователю об успешной отправке (далее можно заменить на отображение сообщения в форме)
                alert('Заказ успешно добавлен');
                //Очищаем поля формы
                $form[0].reset();
            } //Иначе сообщаем об ошибке (далее можно заменить на отображение сообщения в форме)
            else {
                alert('Ошибка добавления заказа');
            }
            //Делаем поля ввода формы снова активными
            $inputs.prop("disabled", false);
            $('#manicurists-select select').attr('disabled', '');
            $('#time-select select').attr('disabled', '');
            $('form#create-order button').attr('disabled', '');
        });
    });
});