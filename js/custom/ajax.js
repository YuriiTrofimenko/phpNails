$(document).ready(function () {

    //Добавляем к стандартному типу Дата функцию коррекции даты по часовому поясу
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });
    //Устанавливаем в элемент ввода Дата (Календарь) текущую дату,
    //вызывая на ней предварительно нашу корректирующую функцию
    $('#calendar').val(new Date().toDateInputValue());
    //Задаем календарю окно допустимых дат - от текущей включительно на 7 дней вперед
    var minDate = new Date();
    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    $('#calendar').attr({
       "min" : minDate.toDateInputValue(),
       "max" : maxDate.toDateInputValue()
    });

    $('#calendar').change(function(ev) {

        //Если обновление календаря вызвано принудительно сценарием
        //после бронирования заказа      
        if (ev.date !== undefined) {
            //Устанавливаем в календарь заранее сохраненное последнее его текущее значение
            $('#calendar').val(ev.date);
        }
        //Заполняем список мастеров
        populateManicuristsList();
        //Заполняем таблицу расписания
        populateTable();
    });

    //Готовим функцию заполнения таблицы данными о заказах
    function populateTable() {
        $('#table-container').html("<div class='progress'><div class='indeterminate'></div></div>");
        //Отправляем асинхронный запрос на сервер (в файл api/orders.php)
        $.ajax({
            url: "api/orders.php",
            dataType: 'json',
            type: "POST",
            data: { 
                'action': 'fetch-orders'
                , 'date': $('#calendar').val()
            },
            cache : false
        }).done(function(data) {
            
            //В ответ получаем json-строку data с данными о всех заказах на выбранную дату

            //Готовим шаблон таблицы заказов при помощи библиотеки Hogan
            var template = Hogan.compile(
                '<h3>'
                +   'Расписание'
                + '</h3>'
                + '<table class="table">'
                +  '<thead>'
                +    '<tr>'
                +      '<th>ID</th>'
                +       '<th>клиент</th>'
                +       '<th>время</th>'
                +       '<th>мастер</th>'
                +    '</tr>'
                +  '</thead>'
                +  '<tbody>'
                +       '{{#orders}}'
                +           '<tr>'
                +               '<th scope="row">{{id}}</th>'
                +               '<td>{{name}}</td>'
                +               '<td>{{hours}}</td>'
                +               '<td>{{manicurist_name}}</td>'
                +            '</tr>'
                +        '{{/orders}}'
                +   '</tbody>'
                + '</table>'
            );
            //Заполняем шаблон данными и помещаем на веб-страницу
            $('#table-container').html(template.render(data));
        });
    }
    //Вызываем функцию заполнения таблицы данными о заказах
    populateTable();

    //Для заполнения списка доступных мастеров с указанием даты
    function populateManicuristsList() {

        //console.log('2 - ' + $('#calendar').val());
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
            
            //В ответ получаем json-строку
            //Готовим шаблон списка мастеров при помощи библиотеки Hogan
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
            //Разблокируем выпадающий список имен мастеров
            $('#manicurists-select select').removeAttr('disabled');

            $('#manicurists-select select').unbind("change");
            //Добавляем к нему обработчик выбора
            $('#manicurists-select select').change(function() {
                //Разблокирование списка выбора времени (часов приема)
                $('#time-select select').removeAttr('disabled');
                //Вызываем заполнение списка часов приема
                populateTimeList();
            });

        });
    }
    populateManicuristsList();

    //Для заполнения списка часов приема
    function populateTimeList() {
        $.ajax({
            url: "api/hours.php",
            dataType: 'json',
            type: "POST",
            data: { 
                'action': 'get-available-hours'
                , 'manicurist-id': $('#manicurists-select select option:selected').val()
                , 'date': $('#calendar').val()
            },
            cache : false
        }).done(function(data) {
            
            //В ответ получаем json-строку с данными
            //Готовим шаблон при помощи библиотеки Hogan
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

        //Отправка асинхронного запроса на изменение данных строки расписания в БД,
        //указывая в параметрах data тип действия и все передаваемые данные формы
        $.ajax({
            url: "api/orders.php",
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
            
            //Сохраняем в переменную последнее значение календаря перед сбросом значений полей формы
            var selectedDate = $('#calendar').val();
            //Проверяем, успешно ли выполнено бронирование
            if (data.result == 'booked') {
                //Сообщаем пользователю об успешной отправке (далее можно заменить на отображение сообщения в форме)
                alert('Заказ успешно добавлен');
                //Очищаем поля формы
                $form[0].reset();
            } //Иначе сообщаем об ошибке (далее можно заменить на отображение сообщения в форме)
            else {
                alert('Ошибка бронирования заказа. Обновите страницу и повторите попытку');
            }
            //Делаем поля ввода формы снова активными
            $inputs.prop("disabled", false);
            $('#manicurists-select select').attr('disabled', '');
            $('#time-select select').attr('disabled', '');
            $('form#create-order button').attr('disabled', '');

            //console.log('0 - ' + selectedDate);
            //Вызываем событие Изменение календаря, передавая в в его аргументах
            //последнее значение календаря, чтобы затем его снова установить
            $('#calendar').trigger({
                type: "change",
                date: selectedDate
            });
        });
    });
});