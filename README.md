# 🛍️ ShopNow.com – Full Stack E-Commerce Application

## 📌 Project Overview

ShopNow.com is a full-stack e-commerce web application built using **Java Spring Boot** for the backend and **React** for the frontend. The platform allows users to browse products, manage carts, and securely place orders with integrated online payments.

---

## 🎯 Features

### 👤 User Features

* User registration & login
* Browse and search products
* View product details
* Add to cart & manage cart
* Secure checkout with online payment
* Order placement and history

### 🛠️ Admin Features

* Add, update, delete products
* Manage inventory
* View and manage orders

---

## 💳 Payment Integration

* Integrated **Stripe** for secure online payments
* Real-time payment processing
* Handles successful and failed transactions
* Ensures secure handling of payment data using Stripe APIs

---

## 🏗️ Tech Stack

### 🔹 Frontend

* React.js
* Axios
* HTML, CSS, JavaScript

### 🔹 Backend

* Java
* Spring Boot
* Spring Data JPA
* REST APIs

### 🔹 Database

* MySQL

### 🔹 Payment Gateway

* Stripe API

---

## 📂 Project Structure

```id="k2l9sd"
shopnow/
│
├── backend/ (Spring Boot)
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   └── models/
│
├── frontend/ (React)
│   ├── components/
│   ├── pages/
│   └── services/
│
└── database/
    └── schema.sql
```

---

## 🔐 Authentication

* Secure user authentication and session management
* (Add JWT here if implemented)

---

## 🔍 Key Functionalities

* RESTful API integration between frontend and backend
* Dynamic product listing and filtering
* Cart management system
* Order processing workflow
* Integrated payment flow using Stripe

---

## ▶️ How to Run the Project

### 1️⃣ Clone the repository

```bash id="p0x1ab"
git clone https://github.com/your-username/shopnow.git
```

---

### 2️⃣ Backend Setup (Spring Boot)

```bash id="a91kdl"
cd backend
```

* Configure MySQL in `application.properties`
* Add your Stripe Secret Key:

```properties id="s92kd1"
stripe.secret.key=your_stripe_secret_key
```

* Run the application:

```bash id="kq82ms"
mvn spring-boot:run
```

---

### 3️⃣ Frontend Setup (React)

```bash id="q92lsl"
cd frontend
npm install
npm start
```

---

## 🗄️ Database Configuration

```properties id="d82lsl"
spring.datasource.url=jdbc:mysql://localhost:3306/shopnow
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

---

## 💡 Stripe Test Cards

Use Stripe test mode for payments:

* Card Number: 4242 4242 4242 4242
* Expiry: Any future date
* CVV: Any 3 digits

---

## 📊 Future Enhancements

* Payment success/failure UI improvements
* Order tracking system
* User reviews & ratings
* Admin analytics dashboard

---

## 🚀 Key Learnings

* Integrated third-party payment gateway (Stripe)
* Built secure checkout flow
* Developed full-stack application using Spring Boot & React
* Managed API communication and state

---

## 🤝 Contribution

Contributions are welcome! Feel free to fork and improve the project.

---

## 📧 Contact

For queries or collaboration, feel free to connect.
