-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 08 2018 г., 14:15
-- Версия сервера: 5.5.53
-- Версия PHP: 5.5.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `nails`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Manicurist`
--

CREATE TABLE `Manicurist` (
  `id` int(11) NOT NULL,
  `name` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Manicurist`
--

INSERT INTO `Manicurist` (`id`, `name`) VALUES
(1, 'Мастер1'),
(2, 'Мастер2');

-- --------------------------------------------------------

--
-- Структура таблицы `Order`
--

CREATE TABLE `Order` (
  `id` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `desired_date` varchar(25) NOT NULL,
  `desired_time_id` int(11) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_id` int(11) NOT NULL,
  `manicurist_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Order`
--

INSERT INTO `Order` (`id`, `name`, `phone`, `desired_date`, `desired_time_id`, `comment`, `created_at`, `status_id`, `manicurist_id`) VALUES
(1, 'имя2', '097-00-00-002', '2018-04-09', 1, 'ав апаи вапав апар2', '2018-04-07 15:44:53', 2, 1),
(2, 'имя3', '097-00-00-003', '2018-04-09', 2, 'ав апаи вапав апар3', '2018-04-07 15:47:14', 2, 1),
(3, 'n1', 'p1', '2018-04-09', 3, 'c1', '2018-04-07 15:52:22', 2, 2),
(4, 'имя4', '097-00-00-004', '2018-04-09', 4, 'ав апаи вапав апар4', '2018-04-07 15:56:51', 2, 2),
(5, 'имя6', '097-00-00-006', '2018-04-10', 1, 'ав апаи вапав апар6', '2018-04-08 10:39:57', 2, 1),
(6, 'имя5', '097-00-00-005', '2018-04-10', 2, 'ав апаи вапав апар5', '2018-04-08 10:40:26', 2, 1),
(7, 'name8', '097-00-00-007', '2018-04-10', 3, 'comment7', '2018-04-08 10:40:38', 2, 2),
(8, 'name7', '097-00-00-007', '2018-04-10', 4, 'lorem ipsum dolor sit amet', '2018-04-08 10:40:50', 2, 2),
(9, '-', '-', '2018-04-12', 3, '-', '2018-04-08 11:12:00', 1, 1),
(10, 'name9', '097-00-00-009', '2018-04-12', 4, 'comment9', '2018-04-08 11:12:06', 2, 1),
(11, 'name10', '097-00-00-010', '2018-04-12', 1, 'c10', '2018-04-08 11:12:18', 2, 2),
(12, '-', '-', '2018-04-12', 2, '-', '2018-04-08 11:12:23', 1, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `ReceptionHours`
--

CREATE TABLE `ReceptionHours` (
  `id` int(11) NOT NULL,
  `hours` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `ReceptionHours`
--

INSERT INTO `ReceptionHours` (`id`, `hours`) VALUES
(1, 'с 09:00 до 12:00'),
(2, 'с 12:00 до 14:00'),
(3, 'с 14:00 до 17:00'),
(4, 'c 17:00 до 19:00');

-- --------------------------------------------------------

--
-- Структура таблицы `Status`
--

CREATE TABLE `Status` (
  `id` int(11) NOT NULL,
  `status` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Status`
--

INSERT INTO `Status` (`id`, `status`) VALUES
(3, 'выполнен'),
(2, 'забронирован'),
(1, 'открыт'),
(4, 'отменен');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Manicurist`
--
ALTER TABLE `Manicurist`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Order`
--
ALTER TABLE `Order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `desired_time_id` (`desired_time_id`),
  ADD KEY `idx_status` (`status_id`),
  ADD KEY `idx_manicurist` (`manicurist_id`);

--
-- Индексы таблицы `ReceptionHours`
--
ALTER TABLE `ReceptionHours`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Status`
--
ALTER TABLE `Status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `status` (`status`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Manicurist`
--
ALTER TABLE `Manicurist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT для таблицы `Order`
--
ALTER TABLE `Order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT для таблицы `ReceptionHours`
--
ALTER TABLE `ReceptionHours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT для таблицы `Status`
--
ALTER TABLE `Status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Order`
--
ALTER TABLE `Order`
  ADD CONSTRAINT `fk_desired_time` FOREIGN KEY (`desired_time_id`) REFERENCES `ReceptionHours` (`id`),
  ADD CONSTRAINT `fk_manicurist` FOREIGN KEY (`manicurist_id`) REFERENCES `Manicurist` (`id`),
  ADD CONSTRAINT `fk_status` FOREIGN KEY (`status_id`) REFERENCES `Status` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
