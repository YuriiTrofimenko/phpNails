<?php
if (isset($_POST['action'])) {

	try {

		$response = "";
		
		required_once '../persistence/db_connector.php';

		if ($pdo) {
			
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
			            
		                $response = "sql eror";
			        } else {

		        		$response = 'created';
			        }
					break;
				}
				
				default:
					//# code...
					break;
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