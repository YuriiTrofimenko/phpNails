<?php
//Если запрос типа POST и содержит параметр с именем action
if (isset($_REQUEST['action'])) {

	//Открываем блок перехвата исключений
	try {

		//Создаем переменную с ответом по умолчанию
		$response = "no results";
		//Подключаем файл работы с БД
		require_once('../persistence/db_connector.php');
		//Подключаем файл работы с БД
		require_once('../persistence/entities/Hour.php'); 

		//Если связь с БД установлена
		if (getDbContext()) {
			
			//Читаем значение параметра запроса с именем action
			$action = $_REQUEST['action'];
		
			//Действуем далее в зависимости от этого значения
			switch ($action) {
				//Запрос создания записи о заказе со страницы index.html (отправлен файлом js/custom/ajax.js)
				/*case 'create-order': {
					//Создаем обхъект Заказ и заполняем его данными из запроса
					$order = new Order(
						$_REQUEST['user-name']
						, $_REQUEST['user-phone']
						, $_REQUEST['calendar']
						, $_REQUEST['menu-361']
						, $_REQUEST['comment']
					);
					//Пытаемся сохранить запись о заказе в таблицу в БД
			        $err = $order->intoDb();
			        //Если при этом произошла ошибка
			        if ($err) {
			            //Помещаем в переменную ответа текст ошибки
		                $response = "sql eror: $err";
			        } else {
			        	//Если сохранение выполнилось успешно - пмещаем в переменную ответа строку created
		        		$response = 'created';
			        }
					break;
				}*/
				//localhost/site1/public_html/api/hours.php?action=get-available-hours&manicurist-id=1&date=2018-04-02
				case 'get-available-hours': {
					//Получаем из БД список заказов в виде многомерного массива
			        $hours = Hour::GetAvailableHours($_REQUEST['manicurist-id'], $_REQUEST['date']);
			        //Кодируем его в формат json и сохраняем в переменную ответа
	        		$response = json_encode(['hours' => $hours]);
					break;
				}

				//Запрос создания записи о заказе со страницы admin/index.html (отправлен файлом admin/js/custom.js)
				//http://localhost/site1/public_html/api/hours.php?action=get-free-hours&manicurist-id=1&date=2018-04-02
				case 'get-free-hours': {
					//Получаем из БД список заказов в виде многомерного массива
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
//var_dump($_REQUEST);