# ⚡ ElectroMart – Java Full Stack Electronics Store

**ElectroMart** is a full-stack e-commerce app built using modern Java backend technologies and a stylish React frontend. It includes **secure authentication**, **product browsing**, **shopping cart**, and **MongoDB integration**, with **Dockerized backend** for easy deployment.

🌐 **Live Frontend:** [https://electronics-mobile-website.vercel.app](https://electronics-mobile-website.vercel.app)  
📦 **GitHub Repo:** [github.com/S-Vignesh-Programmer/Electronics-Mobile-Website](https://github.com/S-Vignesh-Programmer/Electronics-Mobile-Website)

---

##  Key Features

-  Electronics product listing with categories
-  JWT-based authentication & authorization
-  Secure password handling using Bcrypt
-  Add/remove from cart (user-specific)
-  Lazy loading of React components and images
-  Backend containerized using Docker
-  Frontend deployed via Vercel (static hosting)

---

## Tech Stack

| Layer       | Technology                                                  |
|-------------|-------------------------------------------------------------|
| **Frontend**| React.js, Tailwind CSS, React Icons                         |
| **Backend** | Java 17, Spring Boot, Spring MVC, Spring Security           |
| **Database**| MongoDB                                                     |
| **Auth**    | JWT (Token-based), Spring Security, Bcrypt Password Hashing |
| **ORM**     | Hibernate (JPA abstraction for MongoDB if applicable)       |
| **DevOps**  | Docker (only backend)                                       |

---

## Folder Structure
Electronics-Mobile-Website/
├── backend/ # Java Spring Boot app
│ ├── src/ # Main Java source files
│ ├── Dockerfile # Docker config for backend
│ └── pom.xml # Maven project file
├── frontend/ # React + Tailwind app (not containerized)
│ ├── src/ # Components, pages
│ └── package.json # React config
└── README.md

--- 

## API Endpoints
Method	     Endpoint	              Description
POST	  /api/auth/register	      Register a user
POST	  /api/auth/login	          Login & get JWT
GET	    /api/products	            Get all products
GET	    /api/products/{id}	      Product details
POST	  /api/cart/add/:id    	    Add product to cart
DELETE	/api/cart/remove/:id	    Remove product from cart

---


License
Licensed under the MIT License.
