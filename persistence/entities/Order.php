<?php
/*Сущности*/
//Заказ
class Order {

    //уникальный id - будет генерироваться БД при вставке строки
    protected $id;
    //дата создания заказа
    protected $created_at;
    //имя заказчика
    protected $name;
    //телефон заказчика
    protected $phone;
    //желаемая дата
    protected $desired_date;
    //желаемое время
    protected $desired_time_id;
    //комментарий
    protected $comment;
    //
    protected $status_id;
    //
    protected $manicurist_id;

    //Конструктор класса с двумя параметрами со значениями по умолчанию в конце списка параметров
    function __construct(
        $name
    	, $phone
    	, $desired_date
    	, $desired_time_id
    	, $comment
        , $status_id
        , $manicurist_id

    	, $id = 0
    	, $created_at = '') {
        
        $this->name = $name;
        $this->phone = $phone;
        $this->desired_date = $desired_date;
        $this->desired_time_id = $desired_time_id;
        $this->comment = $comment;
        $this->status_id = $status_id;
        $this->manicurist_id = $manicurist_id;

        $this->id = $id;
        $this->created_at = $created_at;
    }

    //object -> DB
    //запись данных в БД
    function intoDb() {

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос добавления строки данных о заказе в таблицу Order
            $ps = $pdo->prepare("INSERT INTO `Order` (name, phone, desired_date, desired_time_id, comment, status_id, manicurist_id)
                                VALUES (:name, :phone, :desired_date, :desired_time_id, :comment, :status_id, :manicurist_id)");
            
            //Превращаем объект в массив
            $ar = get_object_vars($this);
            //Удаляем из него первые два элемента - id и created_at
            array_shift($ar);
            array_shift($ar);
            
            //выполняем запрос к БД для добавления записи
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
    //Чтение одного заказа из БД (сейчас не используется, но может понадобиться в будущем)
    static function fromDB($id) {

        $order = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения строки данных о заказе из таблицы Order
            $ps = $pdo->prepare("SELECT * FROM `Order` WHERE id = ?");
            
            //Пытаемся выполнить запрос на получение данных
            $resultCode = $ps->execute([$id]);
            //Если получилось - записываем данные в объект
            if ($resultCode) {
                
                $row = $ps->fetch();
                $order =
                    new Order(
                            $row['name']
                            , $row['phone']
                            , $row['desired_date']
                            , $row['desired_time_id']
                            , $row['comment']
                            , $row['status_id']
                            , $row['manicurist_id']
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

    //Получение списка всех заказов из БД
    //or
    static function GetOrders($date = '') {

        $ps = null;
        $orders = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения всех строк данных о заказах из таблицы Order,
            //отсортированных от более новых к более старым
            if ($date === '') {
                //echo "1 - $date";
                $ps = $pdo->prepare("SELECT * FROM `Order` ORDER BY `created_at` DESC");
                //Выполняем
                $ps->execute();
            } else {
                //echo "2 - $date";
                $ps = $pdo->prepare(
                    "SELECT `o`.`id`, `o`.`name`, `o`.`phone`, `rh`.`hours`, `o`.`comment`, `m`.`name` AS `manicurist_name`, `st`.`status`, `o`.`created_at` FROM `Manicurist` AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) INNER JOIN `ReceptionHours` AS `rh` ON (`rh`.`id` = `o`.`desired_time_id`) INNER JOIN `Status` AS `st` ON (`o`.`status_id` = `st`.`id`) WHERE `o`.`desired_date` = ? ORDER BY `o`.`created_at` DESC"
                    );
                //Выполняем
                $ps->execute([$date]);
            }

            
            //Сохраняем полученные данные в ассоциативный массив
            $orders = $ps->fetchAll();

            return $orders;
        } catch (PDOException $e) {

            echo $e->getMessage();
            return false;
        }
    }
}

/*

SELECT `o`.`id`, `o`.`name`, `o`.`phone`, `rh`.`hours`, `o`.`comment`, `m`.`name` AS `manicurist_name`, `st`.`status`, `o`.`created_at`
FROM `Manicurist` AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) INNER JOIN `ReceptionHours` AS `rh` ON (`rh`.`id` = `o`.`desired_time_id`) INNER JOIN `Status` AS `st` ON (`o`.`status_id` = `st`.`id`)
WHERE `o`.`desired_date` = '2018-04-09' ORDER BY `o`.`created_at` DESC

SELECT `o`.`id`, `o`.`name`, `o`.`phone`, `rh`.`hours`, `o`.`comment`, `m`.`name` AS `manicurist_name`, `st`.`status`, `o`.`created_at` FROM `Manicurist` AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) INNER JOIN `ReceptionHours` AS `rh` ON (`rh`.`id` = `o`.`desired_time_id`) INNER JOIN `Status` AS `st` ON (`o`.`status_id` = `st`.`id`) WHERE `o`.`desired_date` = '2018-04-09' ORDER BY `o`.`created_at` DESC

*/