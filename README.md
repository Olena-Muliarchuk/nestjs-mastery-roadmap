<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🎵 NestJS Music API (Zero to Hero)

This is an educational project designed to guide a developer from "Hello World" to **Scilled backend developer** using the **NestJS** framework.

I'm building a **RESTful API for a Music Streaming Platform**, where users can browse a catalog of songs and artists, while administrators manage the content. The project emphasizes **Best Practices**, **Security**, and **Scalability**.

---

## 🛠 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (Modular Architecture)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Docker)
- **ORM:** TypeORM (Entities, Relations, Active Record pattern)
- **Authentication:** JWT (JSON Web Tokens), Passport, BCrypt
- **Validation:** Class-validator, Zod (for Environment Variables)
- **Environment:** Docker Compose

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** and **Docker** installed on your machine.

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install

```

### 3. Database Setup (Docker)

Start the PostgreSQL container:

```bash
docker-compose up -d

```

### 4. Environment Configuration

Create a `.env` file in the root directory. You can use the example below:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nest_db

# Security (JWT)
JWT_SECRET=SuperSecretKey123!
JWT_EXPIRATION=1d

```

### 5. Running the App

```bash
# Watch mode (Development)
npm run start:dev

# Production mode
npm run start:prod

```

---

## 🗺 Roadmap & Progress

I'm following a strict "Zero to Hero" roadmap based on official NestJS documentation and enterprise standards.

### 🟢 Block 1: Foundations

* [x] CLI, Project Structure, `main.ts` setup
* [x] **Controllers:** Routing, Request Handling (`@Body`, `@Query`, `@Param`)
* [x] **Providers:** Services, Dependency Injection (DI)
* [x] **Modules:** Modular Architecture, imports/exports features

### 🟢 Block 2: Data & Validation

* [x] **Pipes:** `ValidationPipe`, `ParseIntPipe`
* [x] **DTOs:** Input validation using `class-validator`
* [x] **Serialization:** Response transformation (`@Exclude` password) using `ClassSerializerInterceptor`

### 🟡 Block 3: Database & ORM

* [x] **TypeORM Setup:** PostgreSQL connection
* [x] **Entities:** `User`, `Song`, `Artist` models
* [x] **Relations:** One-to-Many relationships
* [ ] **Migrations:** Database version control (Current status: `synchronize: true`)

### 🟡 Block 4: Security & Auth (Current Focus 📍)

* [x] **Users Module:** User creation & password hashing (`bcrypt`)
* [x] **Authentication:** Login logic & JWT generation
* [x] **JWT Strategy:** Passport integration, Bearer Token validation
* [x] **Guards:** Protecting routes with `AuthGuard`
* [ ] **Custom Decorators:** `@User()` decorator for better DX
* [ ] **Authorization (RBAC):** `Admin` vs `User` roles, `RolesGuard`

### ⚪️ Block 5: Advanced Patterns

* [x] **ConfigModule:** Environment validation with **Zod** (Implemented early for stability)
* [ ] **Caching:** Redis integration
* [ ] **Task Scheduling:** Cron jobs
* [ ] **File Upload:** Handling images/audio files

### ⚪️ Block 6: Testing & DevOps

* [ ] **Unit Testing:** Jest, mocking services/repositories
* [ ] **E2E Testing:** Supertest, dockerized test DB
* [ ] **Documentation:** Swagger/OpenAPI
* [ ] **Docker:** Multi-stage production builds

---

## 📂 Project Structure

```bash
src/
├── app.module.ts        # Root Module
├── main.ts              # Entry Point
├── env.validation.ts    # Zod Schema for .env
├── auth/                # Authentication & Security (JWT, Strategies, Guards)
├── users/               # User Management (Entities, Services)
├── songs/               # Songs Catalog (CRUD)
├── artists/             # Artists Management
└── common/              # Shared Utilities (Decorators, Filters)

```

---

## 👤 Author

This project is built as part of an intensive **NestJS Mentorship Program**.

```

```