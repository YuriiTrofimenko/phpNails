<?php
//Сущность Заказ
class Hour {

    //уникальный id - будет генерироваться БД при вставке строки
    protected $id;
    //название диапазона времени
    protected $hours;

    //Конструктор
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
            //Готовим sql-запрос добавления строки в таблицу ReceptionHours
            $ps = $pdo->prepare("INSERT INTO `ReceptionHours` (hours)
                                VALUES (:hours)");
            
            //Превращаем объект в массив
            $ar = get_object_vars($this);
            //Удаляем из него первый элемент - id
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
    //Чтение одного периода из БД (сейчас не используется, но может понадобиться в будущем)
    static function fromDB($id) {

        $Hour = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения строки данных о периоде из таблицы Hour
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

    //Получение списка всех периодов из БД
    static function GetHours() {

        $ps = null;
        $Hours = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения всех строк данных о периодах из таблицы ReceptionHours
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

    //Получение списка всех периодов из БД, для которых созданы строки заданий
    //для указанных мастера и даты
    static function GetAvailableHours($manicurist_id, $date) {

        $ps = null;
        $Hours = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения всех строк данных о периодах из таблицы Hour,
            //для указанных мастера и даты, еще не переведенных в состояние "забронировано" - статус заказа "1"
            $ps = $pdo->prepare(
                "SELECT `rh`.`id`, `rh`.`hours` FROM `Manicurist` AS `m` INNER JOIN `Order` AS `o` ON (`m`.`id` = `o`.`manicurist_id`) INNER JOIN `ReceptionHours` AS `rh` ON (`rh`.`id` = `o`.`desired_time_id`) WHERE `m`.`id` = ? AND `o`.`desired_date` = ? AND `o`.`status_id` = 1"
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

    //Получение списка всех периодов из БД, для которых для указанных мастера и даты
    //еще не созданы строки заданий
    static function GetFreeHours($manicurist_id, $date) {

        $ps = null;
        $Hours = null;

        try {
            //Получаем контекст для работы с БД
            $pdo = getDbContext();
            //Готовим sql-запрос чтения
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