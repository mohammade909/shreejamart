-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: quickecommerce
-- ------------------------------------------------------
-- Server version	8.0.39

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

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `blog_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` longtext,
  `blog_excerpt` varchar(500) DEFAULT NULL,
  `author_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `tags` varchar(255) DEFAULT NULL,
  `blog_image` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`blog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (10,'5 Reasons Why Every Business Needs an eCommerce Website','<p>In the fast-paced digital world, businesses can’t afford to ignore the benefits of having an online presence. Here’s why an eCommerce website is a game-changer:</p><ol><li><strong>24/7 Accessibility</strong>: Unlike a physical store, an online store is always open. This means customers can shop anytime, anywhere, resulting in more sales.</li><li><strong>Reach a Global Audience</strong>: Break geographical barriers by showcasing your products to customers around the world.</li><li><strong>Lower Operational Costs</strong>: Operating online means fewer expenses compared to a traditional brick-and-mortar store, saving you money in the long run.</li><li><strong>Enhanced Customer Convenience</strong>: With just a few clicks, customers can explore your products, read reviews, and make purchases—all from the comfort of their homes.</li><li><strong>Valuable Customer Insights</strong>: Analytics tools give you insights into customer behavior, helping you optimize your marketing strategies and offerings.</li></ol><p>Building an eCommerce website is no longer optional—it’s essential for staying competitive and growing your business. Start your journey today!</p>','Thinking about taking your business online? Discover the top 5 reasons why an eCommerce website is essential for growth in today’s digital age.',1,'2025-01-28 04:28:49','2025-01-28 05:03:42','published','Market','/blogs/1738038529904-8.jpg','Organic','null'),(11,'7 Proven Ways to Boost Sales on Your eCommerce Store','<p>Running an eCommerce store comes with its challenges, but with these strategies, you can drive sales and retain customers:</p><ol><li><strong>Optimize Product Pages</strong>: Use high-quality images, compelling descriptions, and customer reviews to build trust and improve conversions.</li><li><strong>Leverage Discounts and Offers</strong>: Promotions like free shipping or seasonal discounts encourage customers to make purchases.</li><li><strong>Engage on Social Media</strong>: Use platforms like Instagram and Facebook to showcase your products and interact with potential customers.</li><li><strong>Simplify the Checkout Process</strong>: A quick and easy checkout reduces cart abandonment. Avoid unnecessary steps and offer multiple payment options.</li><li><strong>Add Personalization</strong>: Use AI-driven recommendations to suggest products based on browsing and purchase history.</li><li><strong>Launch Email Campaigns</strong>: Send newsletters with product updates, discount codes, and personalized recommendations directly to customers’ inboxes.</li><li><strong>Optimize for Mobile</strong>: Ensure your website is mobile-friendly, as most customers shop on their smartphones.</li></ol><p>Implement these tactics to create a better shopping experience for your customers and watch your sales grow.</p>','Looking to drive more revenue from your online store? Follow these seven tips to boost sales and create a seamless shopping experience.',1,'2025-01-28 04:32:15','2025-01-28 06:21:30','published','Apple, Banana','/blogs/1738038735550-4.jpg','Fruits','null'),(12,' Top 10 Trending Products to Sell Online in 2025','<p>Staying ahead of product trends is essential for running a successful online store. Here are the hottest items that customers are searching for in 2025:</p><ol><li><strong>Smart Home Devices</strong>: From voice-controlled lights to smart thermostats, these products are dominating the market.</li><li><strong>Eco-Friendly Items</strong>: Sustainable products like reusable water bottles and biodegradable packaging are a favorite among eco-conscious shoppers.</li><li><strong>Fitness Equipment</strong>: Home gyms are still popular, making resistance bands, weights, and yoga mats a must-have.</li><li><strong>Pet Accessories</strong>: Pet lovers are always looking for new toys, premium pet food, and comfy pet beds.</li><li><strong>Beauty Tools</strong>: Innovative tools like facial rollers and LED skincare masks are trending in the beauty industry.</li><li><strong>Wireless Earbuds</strong>: Portable, stylish, and practical, wireless earbuds remain a tech staple.</li><li><strong>DIY Craft Kits</strong>: As more people embrace creative hobbies, craft kits for knitting, painting, and woodworking are in demand.</li><li><strong>Personalized Gifts</strong>: Custom mugs, photo books, and engraved jewelry are perfect for special occasions.</li><li><strong>Gaming Accessories</strong>: Products like ergonomic gaming chairs and RGB keyboards are essential for avid gamers.</li><li><strong>Health Supplements</strong>: Wellness is key, with customers looking for vitamins, herbal teas, and protein powders.</li></ol><p>Stocking these trending products ensures you attract the right audience and boost your eCommerce store’s revenue this year.</p>','Want to know what products are in demand this year? Check out this list of the top 10 trending products to sell online in 2025.',1,'2025-01-28 04:36:23','2025-01-28 06:21:30','published','Bussiness','/blogs/1738038983649-3.jpg','Groceries','null'),(13,' The Future of Online Shopping: Trends to Watch in 2025','<p>The eCommerce landscape is constantly changing, driven by new technology and shifting customer preferences. Here are the most exciting trends to look out for in 2025:</p><h4><strong>1. AI-Powered Personalization</strong></h4><p>Artificial intelligence is transforming online shopping. Personalized product recommendations, AI-driven chatbots, and tailored email campaigns are becoming the norm.</p><h4><strong>2. Voice Commerce</strong></h4><p>Smart speakers like Amazon Alexa and Google Assistant are revolutionizing shopping. Voice search and voice-enabled purchases are on the rise, offering customers ultimate convenience.</p><h4><strong>3. Green Shopping</strong></h4><p>Sustainability matters. Customers are demanding eco-friendly packaging, carbon-neutral shipping, and ethical business practices. Going green isn’t just trendy—it’s essential.</p><h4><strong>4. AR and VR Integration</strong></h4><p>Augmented and virtual reality are helping customers \"try before they buy.\" From virtual fitting rooms to 3D product previews, AR and VR are boosting buyer confidence.</p><h4><strong>5. Mobile-First Experiences</strong></h4><p>Mobile shopping continues to dominate. Responsive, fast-loading mobile websites and apps ensure customers can shop seamlessly on the go.</p><h4><strong>6. Subscription Models</strong></h4><p>Subscription boxes for beauty, fitness, and even groceries are gaining popularity. Recurring revenue is a win-win for businesses and customers alike.</p><h4><strong>7. Social Commerce</strong></h4><p>Platforms like Instagram, TikTok, and Pinterest are turning into shopping hubs. Businesses can now sell directly through these channels, bridging the gap between social media and eCommerce.</p><p>By embracing these trends, your business can stay ahead of the competition and meet evolving customer expectations. The future of online shopping is bright—get ready to shine!</p>','The eCommerce industry is evolving rapidly! Discover the top trends shaping online shopping in 2025 and how your business can stay ahead of the curve.',1,'2025-01-28 05:20:44','2025-01-28 05:20:44','published','Trick','/blogs/1738041644695-6.jpg','-Tips','null');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `vendor_id` int DEFAULT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `cart_id` (`cart_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (15,6,11,1,60.00,'2025-01-13 05:48:12','2025-01-13 05:48:12',NULL),(34,14,12,1,50.00,'2025-01-30 06:46:48','2025-01-30 06:47:08',3);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (6,6,'2025-01-13 05:48:12','2025-01-13 05:48:12'),(10,8,'2025-01-14 11:23:00','2025-01-14 11:23:00'),(14,4,'2025-01-30 06:46:48','2025-01-30 06:46:48');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `parent_category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Fruits & Vegetables','Fresh fruits and vegetables',NULL,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(2,'Groceries & Staples','Daily essentials and pantry staples',NULL,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(3,'Dairy Products','Milk, cheese, and other dairy products',NULL,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(4,'Bakery & Snacks','Breads, biscuits, and snacks',NULL,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(5,'Beverages','Tea, coffee, juices, and other drinks',NULL,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(6,'Personal Care','Skin, hair, and personal hygiene products',NULL,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(8,'Meat & Seafood','Fresh and frozen meat and seafood',NULL,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(9,'Organic Products','Organic and eco-friendly products',NULL,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(10,'Fresh Fruits','Seasonal and imported fresh fruits',1,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(11,'Fresh Vegetables','Daily vegetables, exotic veggies',1,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(12,'Spices & Masalas','Whole and ground spices',2,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(13,'Rice & Grains','Various rice and grain types',2,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(14,'Milk','Fresh and processed milk',3,'2025-01-04 05:17:31','2025-01-04 05:17:31'),(15,'Cheese','Various types of cheese',3,'2025-01-04 05:17:31','2025-01-04 05:17:31');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `content_type` enum('product','blog_post') NOT NULL,
  `content_id` int NOT NULL,
  `comment_text` text,
  `rating` decimal(2,1) DEFAULT NULL,
  `parent_comment_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_comment_id` (`parent_comment_id`),
  KEY `idx_content` (`content_type`,`content_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,'product',1,'Great sound quality and comfortable for long sessions. Battery life is impressive!',4.5,NULL,'2025-01-01 04:30:00','2025-01-15 04:36:35'),(2,2,'product',1,'Good but the ear cushions could be softer',4.0,NULL,'2025-01-02 06:00:00','2025-01-15 04:36:35'),(3,3,'product',1,'Excellent noise cancellation feature',5.0,NULL,'2025-01-03 08:45:00','2025-01-15 04:36:35'),(4,4,'product',2,'Perfect fitness tracking but battery drains quickly',3.5,NULL,'2025-01-04 04:15:00','2025-01-15 04:36:35'),(5,5,'product',2,'Sleek design and intuitive interface',4.5,NULL,'2025-01-05 10:50:00','2025-01-15 04:36:35');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  KEY `jmjm_idx` (`user_id`),
  CONSTRAINT `jmjm` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (3,43,'driving_license','/partners/mohmmadaasif_82cf71/default-blogpost.png','default-blogpost.png','2025-01-21 16:41:31'),(4,43,'bike_rc','/partners/mohmmadaasif_82cf71/concentric.png','concentric.png','2025-01-21 16:41:31');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_recipients`
--

DROP TABLE IF EXISTS `notification_recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_recipients` (
  `recipient_id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int NOT NULL,
  `user_id` int NOT NULL,
  `seen` tinyint(1) DEFAULT '0',
  `seen_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`recipient_id`),
  KEY `notification_id` (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notification_recipients_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`notification_id`) ON DELETE CASCADE,
  CONSTRAINT `notification_recipients_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_recipients`
--

LOCK TABLES `notification_recipients` WRITE;
/*!40000 ALTER TABLE `notification_recipients` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_recipients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','inactive') DEFAULT 'active',
  `type` varchar(50) DEFAULT NULL,
  `users` tinyint DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'This is the gentle remender','Testing the notification',1,'2025-02-03 05:38:40','active','warning',1);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `vendor_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_description` text,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `item_total` decimal(10,2) NOT NULL,
  `images` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_id`),
  KEY `order_items_ibfk_1` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `order_number` varchar(45) NOT NULL,
  `location` text NOT NULL,
  `partner_id` int DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) DEFAULT '0.00',
  `gst` decimal(10,2) DEFAULT '0.00',
  `delivery_charge` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `notes` text,
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `cosutmer_pin` varchar(45) DEFAULT NULL,
  `cancel_reason` text,
  `payment_status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `payment_method` varchar(45) DEFAULT 'COD',
  `order_status` enum('pending','picked','transit','completed','cancelled') DEFAULT 'pending',
  `vendor_pin` varchar(45) DEFAULT NULL,
  `vendor_id` int DEFAULT NULL,
  `placed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_number` (`order_number`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `partner_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `delivery_zone` varchar(255) DEFAULT NULL,
  `partner_status` enum('active','inactive') DEFAULT 'active',
  `wallet_balance` decimal(10,2) DEFAULT '0.00',
  `documents` json DEFAULT NULL,
  `account_number` varchar(45) DEFAULT NULL,
  `ifsc_code` varchar(45) DEFAULT NULL,
  `kyc_status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  `bank_name` varchar(45) DEFAULT NULL,
  `vehicle_model` varchar(45) DEFAULT NULL,
  `vehicle_no` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`partner_id`),
  KEY `bjkjk_idx` (`user_id`),
  CONSTRAINT `bjkjk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
INSERT INTO `partners` VALUES (1,21,'Zone 1','active',1000.00,'{\"file_path\": \"path/to/identity1.jpg\", \"document_type\": \"identity\"}',NULL,NULL,'verified',NULL,NULL,NULL,'2025-01-20 11:16:40','2025-01-20 11:16:40'),(2,22,'Zone 2','active',1500.00,'{\"file_path\": \"path/to/identity2.jpg\", \"document_type\": \"identity\"}',NULL,NULL,'pending',NULL,NULL,NULL,'2025-01-20 11:16:40','2025-01-22 04:56:31'),(3,23,'Zone 3','inactive',2000.00,'{\"file_path\": \"path/to/identity3.jpg\", \"document_type\": \"identity\"}',NULL,NULL,'verified',NULL,NULL,NULL,'2025-01-20 11:16:40','2025-01-20 11:16:40'),(15,43,NULL,'inactive',1.00,NULL,'7789324','PUNB454','pending','punjab','modal','UP78923','2025-01-21 11:11:31','2025-01-25 06:46:12');
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `vendor_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `price` decimal(10,2) DEFAULT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `unit_of_measurement` enum('kg','g','litre','ml','piece','pack') DEFAULT 'kg',
  `stock_quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `category_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `images` json DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT '0.00',
  `quantitiy` decimal(5,2) DEFAULT '0.00',
  `is_perishable` tinyint(1) DEFAULT '1',
  `discount_percentage` decimal(5,2) DEFAULT '0.00',
  `status` enum('available','out_of_stock','in_stock','pending','reject') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Fresh Apples','Sweet and crisp apples',3.50,100.00,'kg',99.00,1,NULL,'{\"other_images\": [\"https://example.com/images/apples1.jpg\", \"https://example.com/images/apples2.jpg\", \"https://example.com/images/apples3.jpg\"], \"featured_image\": \"https://example.com/images/apples_featured.jpg\"}','2025-01-15',0.00,0.00,1,10.00,'reject','2025-01-03 11:00:43','2025-02-03 04:22:59'),(2,2,'Organic Bananas','Perfectly ripe organic bananas',2.00,50.00,'kg',80.00,1,NULL,'{\"other_images\": [\"https://example.com/images/bananas1.jpg\", \"https://example.com/images/bananas2.jpg\"], \"featured_image\": \"https://example.com/images/bananas_featured.jpg\"}','2025-01-10',0.00,0.00,1,5.00,'available','2025-01-03 11:00:43','2025-02-03 04:22:59'),(3,3,'Whole Wheat Bread','Freshly baked whole wheat bread',1.99,59.00,'piece',50.00,2,NULL,'{\"other_images\": [\"https://example.com/images/bread1.jpg\"], \"featured_image\": \"https://example.com/images/bread_featured.jpg\"}',NULL,0.00,0.00,0,0.00,'available','2025-01-03 11:00:43','2025-02-03 04:22:59'),(4,1,'Organic Milk','Fresh organic milk in eco-friendly packaging',1.50,30.00,'litre',200.00,3,NULL,'{\"other_images\": [\"https://example.com/images/milk1.jpg\", \"https://example.com/images/milk2.jpg\"], \"featured_image\": \"https://example.com/images/milk_featured.jpg\"}','2025-01-05',0.00,0.00,1,0.00,'available','2025-01-03 11:00:43','2025-02-03 04:22:59'),(5,2,'Brown Rice','Nutritious long-grain brown rice',4.00,34.00,'kg',150.00,4,NULL,'{\"other_images\": [\"https://example.com/images/rice1.jpg\", \"https://example.com/images/rice2.jpg\", \"https://example.com/images/rice3.jpg\"], \"featured_image\": \"https://example.com/images/rice_featured.jpg\"}',NULL,0.00,0.00,0,15.00,'available','2025-01-03 11:00:43','2025-02-03 04:22:59'),(6,2,'Almonds','Premium quality raw almonds',12.50,45.00,'kg',0.00,0,NULL,'{\"other_images\": [\"https://example.com/images/almonds1.jpg\", \"https://example.com/images/almonds2.jpg\"], \"featured_image\": \"https://example.com/images/almonds_featured.jpg\"}',NULL,0.00,0.00,0,0.00,'out_of_stock','2025-01-03 11:00:43','2025-02-03 04:22:59'),(7,1,'Tomatoes','Fresh and juicy tomatoes',1.20,23.00,'kg',90.00,1,NULL,'{\"other_images\": [\"https://example.com/images/tomatoes1.jpg\", \"https://example.com/images/tomatoes2.jpg\"], \"featured_image\": \"https://example.com/images/tomatoes_featured.jpg\"}','2025-01-08',0.00,0.00,1,8.00,'available','2025-01-03 11:00:43','2025-02-03 04:22:59'),(8,2,'Olive Oil','Cold-pressed extra virgin olive oil',10.00,12.00,'litre',60.00,6,NULL,'{\"other_images\": [\"https://example.com/images/oliveoil1.jpg\", \"https://example.com/images/oliveoil2.jpg\"], \"featured_image\": \"https://example.com/images/oliveoil_featured.jpg\"}','2025-12-31',0.00,0.00,0,12.00,'available','2025-01-03 11:00:43','2025-02-03 04:22:59'),(9,2,'Potato Chips 52g, American Cream & Onion Flavour, Crunchy Chips & Snacks.','<p>gkhgkg</p>',132.00,34.00,'litre',123.00,3,NULL,'{\"other_images\": [\"/products/Test/cup-removebg-preview.png\", \"/products/Test/cup.jpg\"], \"featured_image\": \"/products/Test/istockphoto-1905363940-612x612.jpg\"}','2025-01-10',0.00,0.00,1,2.00,'available','2025-01-06 10:41:14','2025-02-03 04:22:59'),(10,2,'Potato Chips 52g, American Cream & Onion Flavour','<p><strong>Marketing</strong></p><ul><li><a href=\"https://economictimes.indiatimes.com/definition/pricing-strategies\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(0, 0, 0);\">PREV DEFINITION</a></li><li><a href=\"https://economictimes.indiatimes.com/definition/product-life-cycle\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(0, 0, 0);\">NEXT DEFINITION</a></li></ul><h1>What is \'Product\'</h1><p><br></p><p class=\"ql-align-justify\"><strong style=\"background-color: transparent;\">Definition:&nbsp;</strong>A product is the item offered for sale. A product can be a service or an item. It can be physical or in virtual or cyber form. Every product is made at a cost and each is sold at a price. The price that can be charged depends on the market, the quality, the marketing and the segment that is targeted. Each produc</p><p><br></p>',20.00,45.00,'piece',196.00,12,NULL,'{\"other_images\": [\"/products/Test2/clay-cooker-5l-daksh-craft-villa-original-imafh7e2zgnzesyb.webp\", \"/products/Test2/earthenware-pressure-cooker-414.webp\", \"/products/Test2/617E1rTbn2L._SX679_.jpg\"], \"featured_image\": \"/products/Test2/earthenware-pressure-cooker-414.webp\"}','2025-01-15',0.00,0.00,1,12.00,'available','2025-01-06 15:39:40','2025-02-03 04:22:59'),(11,2,'Buffalo Milk','<p><strong style=\"color: rgb(32, 33, 34);\">Dairy products</strong><span style=\"color: rgb(32, 33, 34);\">&nbsp;or&nbsp;</span><strong style=\"color: rgb(32, 33, 34);\">milk products</strong><span style=\"color: rgb(32, 33, 34);\">, also known as&nbsp;</span><strong style=\"color: rgb(32, 33, 34);\">lacticinia</strong><span style=\"color: rgb(32, 33, 34);\">, are&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Food_product\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">food products</a><span style=\"color: rgb(32, 33, 34);\">&nbsp;made from (or containing)&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Milk\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">milk</a><span style=\"color: rgb(32, 33, 34);\">.</span><a href=\"https://en.wikipedia.org/wiki/Dairy_product#cite_note-1\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c); background-color: initial;\"><sup>[1]</sup></a><span style=\"color: rgb(32, 33, 34);\">&nbsp;The most common dairy animals are&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Cow\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">cow</a><span style=\"color: rgb(32, 33, 34);\">,&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Water_buffalo\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">water buffalo</a><span style=\"color: rgb(32, 33, 34);\">,&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Goat\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">nanny goat</a><span style=\"color: rgb(32, 33, 34);\">, and&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Sheep\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">ewe</a><span style=\"color: rgb(32, 33, 34);\">. Dairy products include common grocery store food around the world such as&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Yogurt\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">yogurt</a><span style=\"color: rgb(32, 33, 34);\">,&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Cheese\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">cheese</a><span style=\"color: rgb(32, 33, 34);\">,&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Milk\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">milk</a><span style=\"color: rgb(32, 33, 34);\">&nbsp;and&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Butter\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">butter</a><span style=\"color: rgb(32, 33, 34);\">.</span><a href=\"https://en.wikipedia.org/wiki/Dairy_product#cite_note-2\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c); background-color: initial;\"><sup>[2]</sup></a><a href=\"https://en.wikipedia.org/wiki/Dairy_product#cite_note-3\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c); background-color: initial;\"><sup>[3]</sup></a><span style=\"color: rgb(32, 33, 34);\">&nbsp;A facility that produces dairy products is a&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Dairy\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c); background-color: initial;\"><em>dairy</em></a><span style=\"color: rgb(32, 33, 34);\">.</span><a href=\"https://en.wikipedia.org/wiki/Dairy_product#cite_note-4\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c); background-color: initial;\"><sup>[a]</sup></a><a href=\"https://en.wikipedia.org/wiki/Dairy_product#cite_note-5\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c); background-color: initial;\"><sup>[4]</sup></a><span style=\"color: rgb(32, 33, 34);\">&nbsp;Dairy products are consumed worldwide to varying degrees.</span><a href=\"https://en.wikipedia.org/wiki/Dairy_product#cite_note-fao-6\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c); background-color: initial;\"><sup>[5]</sup></a><span style=\"color: rgb(32, 33, 34);\">&nbsp;Some people avoid some or all dairy products because of&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Lactose_intolerance\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">lactose intolerance</a><span style=\"color: rgb(32, 33, 34);\">,&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Veganism\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">veganism</a><span style=\"color: rgb(32, 33, 34);\">,&nbsp;</span><a href=\"https://en.wikipedia.org/wiki/Environmental_issues\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--color-progressive,#36c);\">environmental concerns</a><span style=\"color: rgb(32, 33, 34);\">, other health reasons or beliefs.</span></p>',60.00,43.00,'litre',195.00,14,NULL,'{\"other_images\": [\"/products/Buffalo_Milk/parallax06_15.webp\", \"/products/Buffalo_Milk/product-jpeg-250x250.webp\", \"/products/Buffalo_Milk/images.jpg\"], \"featured_image\": \"/products/Buffalo_Milk/product-jpeg-250x250.webp\"}','2025-01-09',0.00,0.00,1,2.00,'reject','2025-01-07 05:06:59','2025-02-03 04:22:59'),(12,3,'Sugar','<h3><strong>Premium Sugar Products Description</strong></h3><p>Discover the perfect balance of purity and sweetness with our wide range of sugar products, crafted to elevate every culinary creation. Whether for baking, cooking, or simply sweetening your favorite drinks, our sugar guarantees quality and satisfaction.</p><h4><strong>Product Highlights:</strong></h4><ul><li><strong>Variety Selection:</strong> Available in granulated, powdered, and brown sugar options.</li><li><strong>Pure &amp; Natural:</strong> Clean and refined for a smooth, consistent taste.</li><li><strong>Versatile Usage:</strong> Ideal for baking, beverages, sauces, and confections.</li><li><strong>Convenient Packaging:</strong> Easy storage solutions for home or professional use.</li></ul><p>Enjoy the sweet simplicity that transforms ordinary recipes into extraordinary treats. Experience the taste that makes every dish delightful!</p>',50.00,21.00,'kg',47.00,2,NULL,'{\"other_images\": [\"/products/Sugar/lite-sweeet-single-layer-png-500x500.webp\", \"/products/Sugar/-2z19socw.avif\", \"/products/Sugar/white-sugar-img1.webp\"], \"featured_image\": \"/products/Sugar/81bBdhiCAL.jpg\"}','2025-01-26',1.00,0.00,1,2.00,'reject','2025-01-10 17:47:58','2025-02-03 04:22:59'),(13,6,'Organic Crunchy Peanut Butter - 500g Jar','<p>Enjoy the wholesome goodness of <strong>Organic Crunchy Peanut Butter</strong>, crafted from 100% roasted peanuts for an authentic, rich flavor. This natural spread is free from added sugar, preservatives, and palm oil, making it a healthy choice for your daily meals. Its crunchy texture adds a delightful bite, perfect for toast, smoothies, baking, or as a protein-packed snack.</p><h4><strong>Key Features:</strong></h4><ul><li>? <strong>100% Organic Peanuts:</strong> No additives, preservatives, or artificial flavors.</li><li>? <strong>Rich in Protein &amp; Fiber:</strong> Boosts energy and supports muscle health.</li><li>? <strong>No Palm Oil:</strong> Environmentally friendly and heart-healthy.</li><li>? <strong>Gluten-Free &amp; Vegan:</strong> Suitable for various dietary preferences.</li><li>? <strong>Versatile Use:</strong> Great for spreads, dips, smoothies, and baking.</li></ul><p><br></p>',205.92,234.00,'kg',100.00,2,NULL,'{\"other_images\": [\"/products/Organic_Crunchy_Peanut_Butter_-_500g_Jar/peanut2.jpg\", \"/products/Organic_Crunchy_Peanut_Butter_-_500g_Jar/peanut.jpg\"], \"featured_image\": \"/products/Organic_Crunchy_Peanut_Butter_-_500g_Jar/peanut.jpg\"}','2025-02-21',500.00,0.00,1,12.00,'available','2025-02-03 04:40:44','2025-02-03 04:40:44');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews_and_ratings`
--

DROP TABLE IF EXISTS `reviews_and_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews_and_ratings` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(45) NOT NULL,
  `entity_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `review_text` text,
  `review_title` varchar(255) DEFAULT NULL,
  `pros` text,
  `cons` text,
  `date_submitted` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_verified` tinyint(1) DEFAULT '0',
  `helpful_votes` int DEFAULT '0',
  `order_id` int DEFAULT NULL,
  `image_urls` json DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `unique_user_entity_review` (`user_id`,`entity_id`,`entity_type`),
  KEY `idx_entity_type_id` (`entity_type`,`entity_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `reviews_and_ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `reviews_and_ratings_chk_1` CHECK ((`rating` between 0.0 and 5.0))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews_and_ratings`
--

LOCK TABLES `reviews_and_ratings` WRITE;
/*!40000 ALTER TABLE `reviews_and_ratings` DISABLE KEYS */;
INSERT INTO `reviews_and_ratings` VALUES (1,'products',12,4,4.5,'Great smartphone with excellent camera and battery life.','Impressive Smartphone','Great camera, Long battery, Sleek design','Bit expensive, Fragile screen','2025-01-23 11:19:20',1,15,5001,NULL),(2,'partners',1,6,5.0,'Always punctual and handles packages with care.','Top-notch Delivery Service','Timely delivery, Friendly, Professional','None','2025-01-23 11:19:20',1,8,5002,NULL),(3,'products',12,6,3.8,'Good food but slow service during peak hours.','Decent Dining Experience','Tasty food, Nice ambiance','Slow service, Crowded during lunch','2025-01-23 11:19:20',1,6,5003,NULL),(4,'products',4,4,4.2,'Professional cleaning service with attention to detail.','Thorough Home Cleaning','Detailed cleaning, Professional staff','Slightly expensive','2025-01-23 11:19:20',1,10,5004,NULL),(6,'products',10,9,3.0,'The products are very high quilty and pure, I loved it ',NULL,'I like the product qualitiy.','They should improve the delevry ','2025-01-24 05:25:12',0,0,NULL,NULL),(7,'products',11,1,3.0,'Testing',NULL,'Test','test','2025-01-29 07:34:02',0,0,NULL,NULL);
/*!40000 ALTER TABLE `reviews_and_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `txn_no` varchar(45) DEFAULT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) NOT NULL,
  `reference_id` varchar(100) DEFAULT NULL,
  `description` text,
  `transactionType` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (12,'#TXN-XRHHT10',43,49.00,'2025-01-25 12:16:12','completed','Bank transfer','BANK$$3','Bank transfer','withdraw','2025-01-25 12:16:12','2025-01-27 11:07:26');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_locations`
--

DROP TABLE IF EXISTS `user_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_locations` (
  `address_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `phone` varchar(45) NOT NULL,
  `address_type` enum('home','office','other') DEFAULT 'home',
  `full_address` text,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `address_id` (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_locations`
--

LOCK TABLES `user_locations` WRITE;
/*!40000 ALTER TABLE `user_locations` DISABLE KEYS */;
INSERT INTO `user_locations` VALUES (1,NULL,'8790090788','home',NULL,30.64278580,76.85479900,0,'2025-01-09 05:58:36');
/*!40000 ALTER TABLE `user_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(45) NOT NULL,
  `address` text,
  `user_type` enum('customer','vendor','delivery_partner','admin') DEFAULT 'customer',
  `wallet_balance` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ankit','kumar','admin','admin@ecom.com','123456','783497234','kurukshetra','admin',0.00,'2025-01-02 07:16:34','2025-01-20 04:39:04'),(2,'mohmma','deohoe','mohmma.deohoe','teste@exemplo.us','123456','9834678892','Ambala , Punjab','customer',0.00,'2025-01-02 09:48:32','2025-01-08 05:32:23'),(3,'avatar','singh','avatar_singh','avatar@gmail.com','123456','78932479','Chandigarh , Punjab','vendor',0.00,'2025-01-03 04:48:18','2025-01-06 04:24:40'),(4,'md','kaleem','mksd','kaleem@gmail.com','123456','893409798','New Delhi inida','customer',0.00,'2025-01-08 05:29:54','2025-01-08 05:29:54'),(5,'RAJ','KUMAR','RAJ_KUMAR','bhartya@gmail.com','123456','8793279832',NULL,'vendor',0.00,'2025-01-10 16:53:45','2025-01-13 05:32:35'),(6,'Manoj','ta','manoj','manoj@gmail.com','123456','9634135114','kehid','customer',0.00,'2025-01-13 05:43:59','2025-01-25 09:41:50'),(7,'asd','sad','ms','mh@gmail.com','Mohini123','9896709630',NULL,'customer',0.00,'2025-01-14 04:55:29','2025-01-25 09:42:58'),(8,'tstasasd','shkjasd','tstasasd.shkjasd','satish@gmail.com','123456','903409802943','32441','customer',0.00,'2025-01-14 05:10:18','2025-01-14 05:19:22'),(9,'mohammad','satish','mohammad.satish','satish12@gmail.com','123456','12334556667','hfjdsk','customer',0.00,'2025-01-14 06:04:23','2025-01-23 14:19:01'),(10,'mohammad','satish','mohammad_satish','dhashre@gmail.com','123456','9438772367',NULL,'vendor',0.00,'2025-01-14 06:19:16','2025-01-14 06:19:16'),(16,'mohammaduuo232','satish','mohammaduuo232_satish','satish897231@gmail.com','12345678','8934787789','hfjdsk','vendor',0.00,'2025-01-14 07:45:03','2025-01-14 07:45:03'),(17,'mohammad','satish','mohammad.satish2','pp@gmail.com','123456','1234567899','vill basantpur\nvill basantpur, post office mandheri','customer',0.00,'2025-01-15 05:33:04','2025-01-22 16:39:40'),(21,'John','Doe','john_doe','john.doe@example.com','123456','1234567890','123 Main St, City, Country','delivery_partner',1000.00,'2025-01-20 11:15:02','2025-01-20 11:15:02'),(22,'Jane','Smith','jane_smith','jane.smith@example.com','123456','0987654321','456 Elm St, City, Country','delivery_partner',1500.00,'2025-01-20 11:15:02','2025-01-20 11:15:02'),(23,'Susan','Lee','susan_lee','susan.lee@example.com','123456','1122334455','789 Oak St, City, Country','delivery_partner',2000.00,'2025-01-20 11:15:02','2025-01-20 11:15:02'),(43,'mohmmad','aasif','mohmmadaasif_82cf71','tubedev87@gmail.com','123456','09634135114',NULL,'delivery_partner',0.00,'2025-01-21 11:11:31','2025-01-21 11:11:31'),(44,'parth','panchal','parth.panchal','parthp9386@gmail.com','789654','9729150403','kheri markanda','customer',0.00,'2025-01-23 05:32:29','2025-01-23 05:33:19'),(46,'Mara','Hamilton','Mara_Hamilton','symutoru@mailinator.com','kokurowo','+1 (621) 615-8938','Blanditiis ex ut vol','vendor',0.00,'2025-02-02 14:37:08','2025-02-02 14:37:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `vendor_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `vendor_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `address` text,
  `store_name` varchar(255) DEFAULT NULL,
  `registration_number` varchar(100) DEFAULT NULL,
  `kyc_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `bank_account_details` json DEFAULT NULL,
  `brand_details` json DEFAULT NULL,
  `annual_turnover` decimal(15,2) DEFAULT '0.00',
  `monthly_turnover` decimal(15,2) DEFAULT '0.00',
  `rating` decimal(3,2) DEFAULT '0.00',
  `total_sales` decimal(10,2) DEFAULT '0.00',
  `platform_fee_rate` decimal(5,2) DEFAULT '3.00',
  `login_status` enum('active','suspended') DEFAULT 'active',
  `wallet_balance` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vendor_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,2,'John Doe','johndoe@example.com','9876543210','123 Market Street, City','John\'s Store','REG123456','approved','{\"ifsc\": \"IFSC001\", \"bank_name\": \"Bank of XYZ\", \"account_number\": \"123456789\"}','{\"name\": \"John\'s Fashion\", \"category\": \"FOOD\", \"logo_url\": \"https://example.com/logo.png\", \"description\": \"Trendy clothing store\"}',500000.00,45000.00,4.50,120000.00,3.00,'active',0.00,'2025-01-02 10:40:08','2025-01-29 10:55:56'),(2,3,'avatar','avatar@gmail.com','78937445','123 Market Street, City','dhakkamukki','REG123456','pending','{\"ifsc\": \"PUNB8989\", \"bank_name\": \"Punjab National Bank\", \"account_number\": \"111823798930\"}','{\"name\": \"DhakkaMukki\", \"category\": \"Groceries\", \"logo_url\": \"ewgeew\", \"brandType\": \"distributor\", \"description\": \"Testing\"}',0.00,0.00,0.00,0.00,3.00,'active',100.00,'2025-01-03 04:48:18','2025-01-29 10:55:56'),(3,5,'RJ backery','bhartya@gmail.com',NULL,NULL,'RJ backery',NULL,'pending','{\"ifsc\": \"PUNB8989\", \"bank_name\": \"punjab324\", \"account_number\": \"111823798930\"}','{\"name\": \"RJ Backery\", \"category\": \"Food\", \"logo_url\": \"\", \"brandType\": \"distributor\", \"description\": \"RJ Bakery aims to provide fresh and high-quality baked products for retail and wholesale distribution across multiple regions.\"}',0.00,0.00,0.00,0.00,3.00,'active',0.00,'2025-01-10 16:53:45','2025-01-29 10:55:56'),(4,10,'dhnnshre','dhashre@gmail.com','9438772367',NULL,'dhan',NULL,'pending','{\"ifsc\": \"PUNB8989\", \"bank_name\": \"Punjab National Bank\", \"account_number\": \"111823798930\"}','{\"name\": \"Dhan shree\", \"category\": \"Groceries\", \"logo_url\": \"\", \"brandType\": \"distributor\", \"description\": \"RJ Bakery aims to provide fresh and high-quality baked products for retail and wholesale distribution across multiple regions.\"}',0.00,0.00,0.00,0.00,3.00,'active',0.00,'2025-01-14 06:19:16','2025-01-29 10:55:56'),(5,16,'avatar','satish897231@gmail.com','8934787789','hfjdsk','RJ backery','789342987','approved','{\"ifsc\": \"PUNB8989\", \"bank_name\": \"Punjab National Bank\", \"account_number\": \"111823798930\"}','{\"name\": \"RJ Backery\", \"category\": \"Food\", \"logo_url\": \"https://v0.dev/chat/react-onboarding-form-y4sLlermhi8\", \"brandType\": \"distributor\", \"description\": \"RJ Bakery aims to provide fresh and high-quality baked products for retail and wholesale distribution across multiple regions.\"}',10000.00,1000.00,3.60,1000.00,3.00,'active',0.00,'2025-01-14 07:45:03','2025-01-29 10:55:56'),(6,46,'Avram Murray','symutoru@mailinator.com','+1 (621) 615-8938','Blanditiis ex ut vol','Bruno Dillon','994','approved','\"{\\\"ifsc\\\":\\\"Sit voluptatibus off\\\",\\\"bank_name\\\":\\\"Perry Howe\\\",\\\"account_number\\\":\\\"286\\\"}\"','{\"name\": \"Anne Clayton\", \"category\": \"Home & Kitchen\", \"logo_url\": \"/brands/smm.png\", \"brandType\": \"Service Provider\", \"description\": \"Culpa enim numquam e\"}',47.00,7.00,0.00,0.00,3.00,'active',0.00,'2025-02-02 14:37:08','2025-02-03 09:48:24');
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-03 15:56:37
