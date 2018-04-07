<?php
/*Сущности*/
//Заказ
class Manicurist {

    //уникальный id - будет генерироваться БД при вставке строки
    protected $id;
    //имя заказчика
    protected $name;

    //Конструктор класса с двумя параметрами со значениями по умолчанию в конце списка параметров
    function __construct(
        $name
    	, $id = 0
        ) {

        $this->id = $id;
        $this->name = $name;
    }

    //object -> DB
    //запись данных в БД
    function intoDb() {

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос добавления строки данных о заказе в таблицу Manicurist
            $ps = $pdo->prepare("INSERT INTO `Manicurist` (name)
                                VALUES (:name)");
            
            //Превращаем объект в массив
            $ar = get_object_vars($this);
            //Удаляем из него первые два элемента - id и created_at
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

        $manicurist = null;
//SELECT * FROM `Manicurist`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) WHERE 1

/*
SELECT `m`.`id`, `m`.`name`
FROM `Manicurist`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`)
WHERE `o`.`desired_date` = '2018-04-02' AND `o`.`status_id` = 1


SELECT `m`.`id`, `m`.`name` FROM `Manicurist`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) WHERE `o`.`desired_date` = '2018-04-02' AND `o`.`status_id` = 1

SELECT `m`.`id`, `m`.`name`, `rh`.`hours`
FROM `Manicurist`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) INNER JOIN `ReceptionHours` AS `rh` ON (`rh`.`id` = `o`.`desired_time_id`)
WHERE `o`.`desired_date` = '2018-04-02' AND `o`.`status_id` = 1

*/

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения строки данных о заказе из таблицы Manicurist
            $ps = $pdo->prepare("SELECT * FROM `Manicurist` WHERE id = ?");
            
            //Пытаемся выполнить запрос на получение данных
            $resultCode = $ps->execute([$id]);
            //Если получилось - записываем данные в объект
            if ($resultCode) {
                
                $row = $ps->fetch();
                $manicurist =
                    new Manicurist(
                            $row['name']
                        );
                return $manicurist;
            } else {
                $pdo->errorInfo();
                $pdo->errorCode();
                return new Manicurist("");
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            return false;
        }
    }

    //Получение списка всех заказов из БД
    static function GetManicurists() {

        $ps = null;
        $manicurists = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения всех строк данных о заказах из таблицы Manicurist,
            //отсортированных от более новых к более старым
            $ps = $pdo->prepare("SELECT * FROM `Manicurist`");
            //Выполняем
            $ps->execute();
            //Сохраняем полученные данные в ассоциативный массив
            $manicurists = $ps->fetchAll();

            return $manicurists;
        } catch (PDOException $e) {

            echo $e->getMessage();
            return false;
        }
    }

    //Получение списка всех заказов из БД
    static function GetAvailableManicurists($date) {

        $ps = null;
        $manicurists = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения всех строк данных о заказах из таблицы Manicurist,
            //отсортированных от более новых к более старым
            $ps = $pdo->prepare("SELECT `m`.`id`, `m`.`name` FROM `Manicurist`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) WHERE `o`.`desired_date` = ? AND `o`.`status_id` = 1");

            //Выполняем
            $ps->execute([$date]);
            //echo $ps->queryString;
            //Сохраняем полученные данные в ассоциативный массив
            $manicurists = $ps->fetchAll();

            return $manicurists;
        } catch (PDOException $e) {

            echo $e->getMessage();
            return false;
        }
    }
}