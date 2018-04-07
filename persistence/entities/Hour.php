<?php
/*Сущности*/
//Заказ
class Hour {

    //уникальный id - будет генерироваться БД при вставке строки
    protected $id;
    //имя заказчика
    protected $hours;

    //Конструктор класса с двумя параметрами со значениями по умолчанию в конце списка параметров
    function __construct(
        $hour
    	, $id = 0
        ) {

        $this->id = $id;
        $this->hours = $hours;
    }

    //object -> DB
    //запись данных в БД
    function intoDb() {

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос добавления строки данных о заказе в таблицу ReceptionHours
            $ps = $pdo->prepare("INSERT INTO `ReceptionHours` (hours)
                                VALUES (:hours)");
            
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

        $Hour = null;
//SELECT * FROM `Hour`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`Hour_id`) WHERE 1

/*
SELECT `m`.`id`, `m`.`hour`
FROM `Hour`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`Hour_id`)
WHERE `o`.`desired_date` = '2018-04-02' AND `o`.`status_id` = 1


SELECT `m`.`id`, `m`.`hour` FROM `Hour`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`Hour_id`) WHERE `o`.`desired_date` = '2018-04-02' AND `o`.`status_id` = 1

//часы, для которых уже созданы заказы для определенной даты и мастера, но еще не забронированы
SELECT `m`.`id`, `m`.`name`, `rh`.`hours`
FROM `Manicurist` AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) INNER JOIN `ReceptionHours` AS `rh` ON (`rh`.`id` = `o`.`desired_time_id`)
WHERE `m`.`id` = 1 AND `o`.`desired_date` = '2018-04-02' AND `o`.`status_id` = 1

//часы, для которых еще не созданы заказы для определенной даты и мастера
SELECT `rh`.`hours`
FROM `ReceptionHours` AS `rh`
WHERE NOT EXISTS(
        SELECT `rh`.`id`
        FROM `Manicurist`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`)
        WHERE `m`.`id` = 1 AND `o`.`desired_date` = '2018-04-02' AND `rh`.`id` = `o`.`desired_time_id`
    );

SELECT `m`.`id`, `m`.`name`, `rh`.`hours` FROM `Manicurist` AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) INNER JOIN `ReceptionHours` AS `rh` ON (`rh`.`id` = `o`.`desired_time_id`) WHERE `m`.`id` = 1 AND `o`.`desired_date` = '2018-04-02' AND `o`.`status_id` = 1

SELECT `rh`.`hours` FROM `ReceptionHours` AS `rh` WHERE NOT EXISTS(SELECT `rh`.`id` FROM `Manicurist`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) WHERE `m`.`id` = 1 AND `o`.`desired_date` = '2018-04-02' AND `rh`.`id` = `o`.`desired_time_id`);

*/

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения строки данных о заказе из таблицы Hour
            $ps = $pdo->prepare("SELECT * FROM `ReceptionHours` WHERE id = ?");
            
            //Пытаемся выполнить запрос на получение данных
            $resultCode = $ps->execute([$id]);
            //Если получилось - записываем данные в объект
            if ($resultCode) {
                
                $row = $ps->fetch();
                $Hour =
                    new Hour(
                            $row['hours']
                        );
                return $Hour;
            } else {
                $pdo->errorInfo();
                $pdo->errorCode();
                return new Hour("");
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            return false;
        }
    }

    //Получение списка всех заказов из БД
    static function GetHours() {

        $ps = null;
        $Hours = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения всех строк данных о заказах из таблицы ReceptionHours,
            //отсортированных от более новых к более старым
            $ps = $pdo->prepare("SELECT * FROM `ReceptionHours`");
            //Выполняем
            $ps->execute();
            //Сохраняем полученные данные в ассоциативный массив
            $Hours = $ps->fetchAll();

            return $Hours;
        } catch (PDOException $e) {

            echo $e->getMessage();
            return false;
        }
    }

    //Получение списка всех заказов из БД
    static function GetAvailableHours($manicurist_id, $date) {

        $ps = null;
        $Hours = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения всех строк данных о заказах из таблицы Hour,
            //отсортированных от более новых к более старым
            $ps = $pdo->prepare(
                "SELECT `m`.`id`, `m`.`name`, `rh`.`hours` FROM `Manicurist` AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) INNER JOIN `ReceptionHours` AS `rh` ON (`rh`.`id` = `o`.`desired_time_id`) WHERE `m`.`id` = ? AND `o`.`desired_date` = ? AND `o`.`status_id` = 1"
                );

            //Выполняем
            $ps->execute([$manicurist_id, $date]);
            //echo $ps->queryString;
            //Сохраняем полученные данные в ассоциативный массив
            $Hours = $ps->fetchAll();

            return $Hours;
        } catch (PDOException $e) {

            echo $e->getMessage();
            return false;
        }
    }

    //Получение списка всех заказов из БД
    static function GetFreeHours($manicurist_id, $date) {

        $ps = null;
        $Hours = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения всех строк данных о заказах из таблицы Hour,
            //отсортированных от более новых к более старым
            $ps = $pdo->prepare(
                "SELECT `rh`.`id`, `rh`.`hours` FROM `ReceptionHours` AS `rh` WHERE NOT EXISTS(SELECT `rh`.`id` FROM `Manicurist`AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) WHERE `m`.`id` = ? AND `o`.`desired_date` = ? AND `rh`.`id` = `o`.`desired_time_id`);"
                );

            //Выполняем
            $ps->execute([$manicurist_id, $date]);
            //echo $ps->queryString;
            //Сохраняем полученные данные в ассоциативный массив
            $Hours = $ps->fetchAll();

            return $Hours;
        } catch (PDOException $e) {

            echo $e->getMessage();
            return false;
        }
    }
}