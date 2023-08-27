-- MySQL dump 10.13  Distrib 5.7.34, for osx10.17 (x86_64)
--
-- Host: localhost    Database: tecnowins
-- ------------------------------------------------------
-- Server version	5.7.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `respuestas_bots`
--

DROP TABLE IF EXISTS `respuestas_bots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `respuestas_bots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `intents` varchar(140) NOT NULL,
  `respuesta` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuestas_bots`
--

LOCK TABLES `respuestas_bots` WRITE;
/*!40000 ALTER TABLE `respuestas_bots` DISABLE KEYS */;
INSERT INTO `respuestas_bots` VALUES (1,'Consulta_disponibilidad','Sí, aún tenemos esa laptop disponible'),(2,'Consulta_disponibilidad','Disculpe, esa laptop ya se vendió.'),(3,'Consulta_disponibilidad','Actualmente no tenemos esa laptop disponible, pero podemos notificarte cuando la tengamos en stock nuevamente.'),(4,'Consulta_de_precios','El precio de esa laptop es de $Y'),(5,'Consulta_de_precios','El precio es de $Y'),(6,'Consulta_ubicación','Somos tienda virtual, estamos ubicada en Guatire, realizamos entregas gratuitas en Chacao, en el edif de We Code'),(7,'Consulta_ubicación','Nuestra tienda virtual está ubicada en Guatire, pero realizamos entregas gratuitas en Caracas, Guarenas y Guatire.'),(8,'Consulta_entrega','Realizamos entregas gratuitas en Caracas, Guarenas y Guatire sin costo adicional.'),(9,'Consulta_caracteristicas','Esa laptop tiene {MEMORIA_RAM} de RAM y {ALMACENAMIENTO} de almacenamiento, con un procesador de {PROCESADOR}'),(10,'Consulta_caracteristicas','La laptop que buscas tiene un procesador {PROCESADOR}, {MEMORIA_RAM} de RAM y {ALMACENAMIENTO} de almacenamiento'),(11,'Consulta_listado_productos','Además de esa laptop, también tenemos otras opciones con características similares'),(12,'Consulta_listado_productos','Estas son las laptops que tenemos disponibles'),(13,'Consulta_factura','Sí, podemos emitirte una factura por tu compra.'),(14,'Consulta_factura','Sí, nuestra tienda virtual está registrada y podemos emitirte una factura válida para tus impuestos.'),(15,'Consulta_garantia_virtual','Todas nuestras laptops tienen una garantía de 3 meses.'),(16,'Consulta_fotos','Por supuesto, puedo enviarte algunas fotos de este modelo, escribe al WhatsApp https://wa.me/584242071303'),(17,'Consulta_fotos','Claro, puedo enviarte algunas fotos de la laptop, escribe al WhatsApp https://wa.me/584242071303'),(18,'Contacto','Puedes escribirnos por WhatsApp https://wa.me/584242071303'),(19,'Contacto','Puedes enviarnos un mensaje de WhatsApp para obtener más información. https://wa.me/584242071303'),(20,'Saludo','Hola, muy buen día, en que puedo ayudarte?');
/*!40000 ALTER TABLE `respuestas_bots` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-27 19:09:16
