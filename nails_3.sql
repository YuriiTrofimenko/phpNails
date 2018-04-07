-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:3306
-- Время создания: Апр 05 2018 г., 08:15
-- Версия сервера: 5.7.21-0ubuntu0.17.10.1
-- Версия PHP: 7.1.15-0ubuntu0.17.10.1

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
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_id` int(11) NOT NULL,
  `manicurist_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
(1, 'created'),
(2, 'booked'),
(3, 'done'),
(4, 'cancelled');

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
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
