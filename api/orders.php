<?php
if (isset($_POST['action'])) {

	try {

		$response = "no results";
		
		require_once('../persistence/db_connector.php'); 

		if (getDbContext()) {
			
			$action = $_POST['action'];
		

			switch ($action) {

				case 'create-order': {

					$order = new Order(
						$_POST['user-name']
						, $_POST['user-phone']
						, $_POST['calendar']
						, $_POST['menu-361']
						, $_POST['comment']
					);

			        $err = $order->intoDb();

			        if ($err) {
			            
		                $response = "sql eror: $err";
			        } else {

		        		$response = 'created';
			        }
					break;
				}

				case 'fetch-all-orders': {

			        $orders = Order::GetOrders();
	        		$response = json_encode(['orders' => $orders]);
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

	echo $response;
}
//var_dump($_POST);