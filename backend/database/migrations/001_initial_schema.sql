CREATE DATABASE IF NOT EXISTS hoa_lua
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hoa_lua;

CREATE TABLE IF NOT EXISTS campaigns (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NULL,
  status VARCHAR(80) NOT NULL DEFAULT 'upcoming',
  start_date DATE NULL,
  end_date DATE NULL,
  cover_image VARCHAR(500) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_campaigns_slug (slug),
  KEY idx_campaigns_public_order (is_published, display_order, start_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS workshops (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  description LONGTEXT NULL,
  location VARCHAR(255) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  capacity SMALLINT UNSIGNED NOT NULL,
  price DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  cover_image VARCHAR(500) NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_workshops_slug (slug),
  KEY idx_workshops_public_date (is_published, starts_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  workshop_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  participants TINYINT UNSIGNED NOT NULL DEFAULT 1,
  note TEXT NULL,
  status ENUM('pending','confirmed','cancelled','attended') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_workshop FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  KEY idx_bookings_workshop_status (workshop_id, status),
  KEY idx_bookings_email (email),
  KEY idx_bookings_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new','in_progress','resolved','spam') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_contact_status_created (status, created_at),
  KEY idx_contact_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS posts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  cover_image VARCHAR(500) NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_posts_slug (slug),
  KEY idx_posts_public_date (is_published, published_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gallery_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  media_type ENUM('image','video') NOT NULL DEFAULT 'image',
  media_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_gallery_public_order (is_published, display_order, created_at)
) ENGINE=InnoDB;
