<?php
//Если запрос от веб-страницы типа POST или GET и содержит параметр с именем action
if (isset($_REQUEST['action'])) {

	//Открываем блок перехвата исключений (ошибок)
	try {

		//Создаем переменную с ответом по умолчанию
		$response =  json_encode(['result' => 'no-results']);
		//Подключаем файл работы с БД
		require_once('../persistence/db_connector.php');
		//Подключаем файл с классом сущности "Заказ",
		//который содержит методы для чтения и записи этой сущности в БД
		require_once('../persistence/entities/Order.php');

		//Если связь с БД установлена
		if (getDbContext()) {
			
			//Читаем значение параметра запроса с именем action
			$action = $_REQUEST['action'];
		
			//Действуем далее в зависимости от этого значения
			switch ($action) {
				//Запрос создания записи о заказе, отправленный со страницы admin/index.html (отправлен файлом admin/js/custom.js)
				case 'create-order': {
					//Создаем обхъект Заказ и заполняем его данными из запроса
					//(вызывается со страницы администрирования при формировании расписания,
					//в поле "идентификатор статуса" заносится 1 - строка состояния "создан" из таблицы статусов в БД)
					$order = new Order(
						'-'
						, '-'
						, $_REQUEST['date']
						, $_REQUEST['hours-id']
						, '-'
						, 1
						, $_REQUEST['manicurist-id']
					);
					//Пытаемся сохранить запись о заказе в таблицу в БД
			        $err = $order->intoDb();
			        //Если при этом произошла ошибка
			        if ($err) {
			            //Помещаем в переменную ответа текст ошибки
		                $response = json_encode(['result' => "sql eror: $err"]);
			        } else {
			        	//Если сохранение выполнилось успешно - пмещаем в переменную ответа строку created
		        		$response = json_encode(['result' => 'created']);
			        }
					break;
				}
				//Запрос бронирования заказа, отправленный со страницы index.html (отправлен файлом js/custom/ajax.js)
				case 'book-order': {
					//Создаем обхъект Заказ и заполняем его данными из запроса,
					//в поле "идентификатор статуса" заносится 2 - строка состояния "забронирован" из таблицы статусов в БД)
					$order = new Order(
						$_REQUEST['user-name']
						, $_REQUEST['user-phone']
						, $_REQUEST['date']
						, $_REQUEST['hours-id']
						, $_REQUEST['comment']
						, 2
						, $_REQUEST['manicurist-id']
					);
					//Пытаемся обновить запись о заказе в таблицу в БД
			        $err = $order->updateDb();
			        //Если при этом произошла ошибка
			        if ($err) {
			            //Помещаем в переменную ответа текст ошибки
		                $response = "sql eror: $err";
			        } else {
			        	//Если сохранение выполнилось успешно - пмещаем в переменную ответа строку booked
		        		$response = json_encode(['result' => 'booked']);
			        }
					break;
				}
				//Запрос на получение всех записей о заказах за указанную дату,
				//отправленный со страницы admin/index.html (отправлен файлом admin/js/custom.js)
				case 'fetch-orders': {
					//Получаем из БД список заказов в виде многомерного массива
			        $orders = Order::GetOrders($_REQUEST['date']);
			        //Кодируем его в формат json и сохраняем в переменную ответа
	        		$response = json_encode(['orders' => $orders]);
					break;
				}
				//
				case 'update-order-status': {
					//
			        $err = Order::updateOrderStatus($_REQUEST['order-id'], $_REQUEST['status-id']);

			        if ($err) {
			            //Помещаем в переменную ответа текст ошибки
		                $response = "sql eror: $err";
			        } else {
			        	//
		        		$response = json_encode(['result' => 'updated']);
			        }
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

		//Помещаем в переменную ответа текст непредвиденной ошибки,
		//если она произойдет, и выполнится этот блок
        $response = $e->getMessage();
    }
    //Отправляем в браузер то, что получилось в переменной ответа
    //(данные / сообщение об успешном выполнении / об ошибке)
	echo $response;
}