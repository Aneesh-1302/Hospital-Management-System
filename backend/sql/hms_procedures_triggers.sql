-- Hospital Management System schema with stored procedures and triggers.
-- This script uses lowercase table names exactly as requested.

DROP TRIGGER IF EXISTS before_insert_patients_validate_age;
DROP TRIGGER IF EXISTS after_insert_appointments_queue_email;
DROP TRIGGER IF EXISTS after_insert_billing_queue_email;

DROP PROCEDURE IF EXISTS add_patient;
DROP PROCEDURE IF EXISTS book_appointment;
DROP PROCEDURE IF EXISTS generate_bill;

DROP TABLE IF EXISTS email_queue;
DROP TABLE IF EXISTS billing;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS patients;

CREATE TABLE patients (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  contact VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_patients_email (email)
) ENGINE = InnoDB;

CREATE TABLE doctors (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE appointments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id INT UNSIGNED NOT NULL,
  doctor_id INT UNSIGNED NOT NULL,
  appointment_date DATETIME NOT NULL,
  status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (id),
  INDEX idx_appointments_patient_id (patient_id),
  INDEX idx_appointments_doctor_id (doctor_id),
  CONSTRAINT fk_appointments_patient
    FOREIGN KEY (patient_id) REFERENCES patients (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_appointments_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE billing (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id INT UNSIGNED NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (id),
  INDEX idx_billing_patient_id (patient_id),
  CONSTRAINT fk_billing_patient
    FOREIGN KEY (patient_id) REFERENCES patients (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE email_queue (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  status ENUM('PENDING', 'PROCESSING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email_queue_status_created_at (status, created_at)
) ENGINE = InnoDB;

DELIMITER $$

-- Validates patient age before insert.
CREATE TRIGGER before_insert_patients_validate_age
BEFORE INSERT ON patients
FOR EACH ROW
BEGIN
  IF NEW.age < 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Invalid patient age: age cannot be negative';
  END IF;
END $$

-- Queues appointment confirmation email after an appointment is created.
CREATE TRIGGER after_insert_appointments_queue_email
AFTER INSERT ON appointments
FOR EACH ROW
BEGIN
  DECLARE patient_email VARCHAR(255);
  DECLARE patient_name VARCHAR(150);

  SELECT p.email, p.name
  INTO patient_email, patient_name
  FROM patients AS p
  WHERE p.id = NEW.patient_id;

  INSERT INTO email_queue (recipient, subject, body)
  VALUES (
    patient_email,
    'Appointment Confirmation',
    CONCAT(
      'Hello ',
      patient_name,
      ', your appointment is booked on ',
      DATE_FORMAT(NEW.appointment_date, '%Y-%m-%d %H:%i:%s')
    )
  );
END $$

-- Queues billing notification email after a bill is created.
CREATE TRIGGER after_insert_billing_queue_email
AFTER INSERT ON billing
FOR EACH ROW
BEGIN
  DECLARE patient_email VARCHAR(255);
  DECLARE patient_name VARCHAR(150);

  SELECT p.email, p.name
  INTO patient_email, patient_name
  FROM patients AS p
  WHERE p.id = NEW.patient_id;

  INSERT INTO email_queue (recipient, subject, body)
  VALUES (
    patient_email,
    'Billing Details',
    CONCAT(
      'Hello ',
      patient_name,
      ', your bill amount is ₹',
      FORMAT(NEW.amount, 2)
    )
  );
END $$

-- Inserts a new patient and returns the created identifier.
CREATE PROCEDURE add_patient (
  IN p_name VARCHAR(150),
  IN p_email VARCHAR(255),
  IN p_age INT,
  IN p_gender VARCHAR(10),
  IN p_contact VARCHAR(20)
)
BEGIN
  INSERT INTO patients (name, email, age, gender, contact)
  VALUES (p_name, p_email, p_age, p_gender, p_contact);

  SELECT LAST_INSERT_ID() AS patient_id;
END $$

-- Inserts a new appointment and returns the created identifier.
CREATE PROCEDURE book_appointment (
  IN p_patient_id INT UNSIGNED,
  IN p_doctor_id INT UNSIGNED,
  IN p_appointment_date DATETIME
)
BEGIN
  INSERT INTO appointments (patient_id, doctor_id, appointment_date)
  VALUES (p_patient_id, p_doctor_id, p_appointment_date);

  SELECT LAST_INSERT_ID() AS appointment_id;
END $$

-- Inserts a new bill and returns the created identifier.
CREATE PROCEDURE generate_bill (
  IN p_patient_id INT UNSIGNED,
  IN p_amount DECIMAL(10, 2)
)
BEGIN
  INSERT INTO billing (patient_id, amount)
  VALUES (p_patient_id, p_amount);

  SELECT LAST_INSERT_ID() AS bill_id;
END $$

DELIMITER ;
