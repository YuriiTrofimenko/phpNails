<?php
//Если запрос содержит параметр с именем action
if (isset($_REQUEST['action'])) {

	//Открываем блок перехвата исключений
	try {

		//Создаем переменную с ответом по умолчанию
		$response = "no results";
		//Подключаем файл работы с БД
		require_once('../persistence/db_connector.php');
		//Подключаем файл сущности "Рабочие часы"
		require_once('../persistence/entities/Hour.php'); 

		//Если связь с БД установлена
		if (getDbContext()) {
			
			//Читаем значение параметра запроса с именем action
			$action = $_REQUEST['action'];
		
			//Действуем далее в зависимости от этого значения
			switch ($action) {
				//Получение списка доступных периодов работы указанного мастера в указанного день
				//(для формы пользовательской бронирования)
				case 'get-available-hours': {
					//Получаем из БД список заказов в виде многомерного массива
			        $hours = Hour::GetAvailableHours($_REQUEST['manicurist-id'], $_REQUEST['date']);
			        //Кодируем его в формат json и сохраняем в переменную ответа
	        		$response = json_encode(['hours' => $hours]);
					break;
				}
				//Получение списка периодов работы, еще не заданных для указанного мастера на указанный день
				case 'get-free-hours': {
					//Получаем из БД список заказов в виде многомерного массива
					//(для формы создания расписания администратором)
			        $hours = Hour::GetFreeHours($_REQUEST['manicurist-id'], $_REQUEST['date']);
			        //Кодируем его в формат json и сохраняем в переменную ответа
	        		$response = json_encode(['hours' => $hours]);
					break;
				}
				
				default: {
					
					$response = "unknown action";
					break;
				}
			}
		} else {

			$response = "connection eror";
		}
	} catch (Exception $e) {

            $response = $e->getMessage();
    }
    //Отправляем в браузер то, что получилось в переменной ответа
    //(данные / сообщение об успешном выполнении / об ошибке)
	echo $response;
}