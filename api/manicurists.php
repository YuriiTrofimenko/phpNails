<?php
//Если запрос содержит параметр с именем action
if (isset($_REQUEST['action'])) {

	//Открываем блок перехвата исключений
	try {

		//Создаем переменную с ответом по умолчанию
		$response = "no results";
		//Подключаем файл работы с БД
		require_once('../persistence/db_connector.php');
		//Подключаем файл сущности "Мастер маникюра"
		require_once('../persistence/entities/Manicurist.php'); 

		//Если связь с БД установлена
		if (getDbContext()) {
			
			//Читаем значение параметра запроса с именем action
			$action = $_REQUEST['action'];
		
			//Действуем далее в зависимости от этого значения
			switch ($action) {
				//Получение списка всех мастеров
				case 'fetch-all-manicurists': {
					//Получаем из БД список мастеров в виде многомерного массива
			        $manicurists = Manicurist::GetManicurists();
			        //Кодируем его в формат json и сохраняем в переменную ответа
	        		$response = json_encode(['manicurists' => $manicurists]);
					break;
				}
				//Получение списка всех доступных мастеров на указанную дату
				case 'fetch-available-manicurists': {
					//Получаем из БД список мастеров в виде многомерного массива
			        $manicurists = Manicurist::GetAvailableManicurists($_REQUEST['date']);
			        //Кодируем его в формат json и сохраняем в переменную ответа
	        		$response = json_encode(['manicurists' => $manicurists]);
					break;
				}
				//Если ни один обработчик не подошел
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