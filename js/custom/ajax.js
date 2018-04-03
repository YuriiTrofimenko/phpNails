$(document).ready(function () {

    //Обработчик события "отправка формы заказа"
    $('#create-order').submit(function (ev) {

        //Предотвращение отправки формы
        ev.preventDefault();

        // Находим форму отправки заказа на странице
        var $form = $(this);

        //Получаем значения из полей ввода формы
        var $inputs = $form.find("input, select, button, textarea");

        //Подготавливаем данные к отправке
        var serializedData = $form.serialize();

        //Отключаем поля ввода формы на время отправки запроса
        $inputs.prop("disabled", true);

        //Отправка асинхронного запроса на сохранение данных в БД
        $.ajax({
            url: "api/orders.php",
            //method : "post",
            type: "POST",
            data: serializedData,
            cache : false
        }).done(function(data) {
            
            //Если ответ от сервера получен -
            console.log(data);
            $inputs.prop("disabled", false);
        });
    });
});