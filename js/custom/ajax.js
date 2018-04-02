$(document).ready(function () {

    $('#create-order').submit(function (ev) {

        //Предотвращение отправки формы
        ev.preventDefault();
        //console.log("test");
        
        //Получаем значения из полей ввода
        var username = $('input#user-name').val();
        var userphone = $('input#user-phone').val();

        // setup some local variables
        var $form = $(this);

        // Let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");

        // Serialize the data in the form
        var serializedData = $form.serialize();

        // Let's disable the inputs for the duration of the Ajax request.
        // Note: we disable elements AFTER the form data has been serialized.
        // Disabled form elements will not be serialized.
        $inputs.prop("disabled", true);
        
        //Отправка асинхронного запроса
        /*$.ajax({
            url: "http://localhost/api/index.php?action=createorder"
                +"&username="
                + username
                + "&userphone="
                + userphone,
            //dataType: 'json',
            method : "post",

            cache : false
        }).done(function(data) {
            
            console.log(data);
        });*/

        $.ajax({
            url: "api/index.php",
            //method : "post",
            type: "POST",
            data: serializedData,
            cache : false
        }).done(function(data) {
            
            console.log(data);
            $inputs.prop("disabled", false);
        });
    });
});