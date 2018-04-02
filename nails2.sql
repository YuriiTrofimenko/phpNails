-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 02 2018 г., 21:44
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
-- Структура таблицы `Order`
--

CREATE TABLE `Order` (
  `id` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `desired_date` varchar(25) NOT NULL,
  `desired_time` varchar(25) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Order`
--

INSERT INTO `Order` (`id`, `name`, `phone`, `desired_date`, `desired_time`, `comment`, `created_at`) VALUES
(1, 'Vasia', '911', '2012-06-01', 'с 09:00 до 12:00', 'comment1', '2018-04-02 17:01:07'),
(2, 'Masha', '097-00-00-000', '2012-06-03', 'с 14:00 до 17:00', 'comment2', '2018-04-02 18:27:38');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Order`
--
ALTER TABLE `Order`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Order`
--
ALTER TABLE `Order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
