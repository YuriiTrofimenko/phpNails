<?php

/*DB context variable*/
$pdo = false;

/*Connection string components*/
$host = "localhost:3306";
$user = "root";
$pass = "root";
$dbname = "nails"
$cs = 'mysql:host=' . $host . ';dbname=' . $dbname . ';charset=utf8;';

/*Connection options*/
$options = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES UTF8'
);

/*Try to get DB context*/
//try {
    $pdo = new PDO($cs, $user, $pass, $options);
//} catch (PDOException $e) {
    //echo mb_convert_encoding($e->getMessage(), 'UTF-8', 'Windows-1251');
//}

/*Entities*/
//TODO add status field
class Order {

    protected $id;
    protected $name;
    protected $phone;
    protected $desired_date;
    protected $desired_time;
    protected $comment;
    protected $created_at;

    function __construct($name
    	, $phone
    	, $desired_date
    	, $desired_time
    	, $comment
    	, $id = 0
    	, $created_at = '') {

        $this->id = $id;
        $this->name = $name;
        $this->phone = $phone;
        $this->desired_date = $desired_date;
        $this->desired_time = $desired_time;
        $this->comment = $comment;
        $this->created_at = $created_at;
    }

    //object -> DB
    function intoDb() {

        try {
            
            $ps = $pdo->prepare("INSERT INTO `Order` (name,phone,desired_date,desired_time,comment)
                                VALUES (:name,:phone,:desired_date,:desired_time,:comment)");
            
            //$ar = (array) $this;
            $ar = get_object_vars($this);
            //var_dump($ar);
            array_shift($ar);
            
            //var_dump($ar);
            //var_dump($ps->queryString);
            $ps->execute($ar);
        } catch (PDOException $e) {

            $err = $e->getMessage();

            if (substr($err, 0, strrpos($err, ":")) == 'SQLSTATE[23000]:Integrity constraint violation') {

                return 1062;

            } else {

                return $e->getMessage();
            }
        }
    }

    //DB -> object
    static function fromDB($id) {

        $order = null;

        try {
            
            $ps = $pdo->prepare("SELECT * FROM `Order` WHERE id = ?");
            
            //var_dump($ps->queryString);
            //var_dump($id);
            $resultCode = $ps->execute([$id]);
            //$res = $ps->execute();
            //var_dump($resultCode);
            if ($resultCode) {
                
                $row = $ps->fetch();
                $order =
                    new Order(
                            $row['name']
                            , $row['phone']
                            , $row['desired_date']
                            , $row['desired_time']
                            , $row['comment']
                            , $row['id']
                            , $row['created_at']
                        );
                return $order;
            } else {
                $pdo->errorInfo();
                $pdo->errorCode();
                return new Order("", "", "");
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            return false;
        }
    }
}

/*Data controllers*/
/*class OrderController {


}*/