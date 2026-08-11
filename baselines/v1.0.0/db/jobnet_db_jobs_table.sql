-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: mysql-4effb70-afolabiademola27-2f5e.f.aivencloud.com    Database: jobnet_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '047375f0-7e9c-11f0-915f-4ab463b0b912:1-418,
1b6c48d9-1438-11f1-bd33-3231259d30c7:1-1232,
2b74ec57-945e-11f1-8dad-c2889fa3b037:1-19,
54936053-0200-11f1-9677-326762bc1d60:1-27,
78d33538-7003-11f1-a4af-f62aa7280959:1-189,
93a1aef8-5dd4-11f1-a797-42583815509d:1-63,
dc9034c6-af7d-11f0-95b9-422854bc4b8e:1-1103,
f38d3c79-63f3-11f1-9b0e-2655c7b2193c:1-29';

--
-- Table structure for table `jobs_table`
--

DROP TABLE IF EXISTS `jobs_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs_table` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `overview` text COLLATE utf8mb4_general_ci,
  `description` text COLLATE utf8mb4_general_ci,
  `requirements` text COLLATE utf8mb4_general_ci,
  `responsibilities` text COLLATE utf8mb4_general_ci,
  `employer_id` int NOT NULL,
  `company_id` int DEFAULT NULL,
  `status` enum('pending','active','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `published_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `location` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `salary_amount` decimal(10,2) DEFAULT NULL,
  `currency` enum('NGN','USD','GBP','EUR') COLLATE utf8mb4_general_ci DEFAULT 'NGN',
  `salary_duration` enum('Hourly','Monthly','Weekly') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `experience_level` enum('Fresher','Junior','Mid','Senior','No-Experience','Internship','Expert') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `english_fluency` enum('Basic','Intermediate','Fluent','Native') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `employment_type` enum('fulltime','parttime','contract','internship','fixedprice','freelance','remote') COLLATE utf8mb4_general_ci NOT NULL,
  `category_id` int DEFAULT NULL,
  `nice_to_have` text COLLATE utf8mb4_general_ci,
  `benefits` text COLLATE utf8mb4_general_ci,
  `deadline` date DEFAULT NULL,
  PRIMARY KEY (`job_id`),
  KEY `fk_employer` (`employer_id`),
  KEY `fk_company` (`company_id`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_employer` FOREIGN KEY (`employer_id`) REFERENCES `users_table` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-11 17:33:18
