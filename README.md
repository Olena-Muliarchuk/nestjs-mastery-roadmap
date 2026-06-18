<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🎵 NestJS Music API (Zero to Hero) — Phase 1: Classic Monolith

> **⚠️ Project Evolution Notice**
> This repository represents the **completed Phase 1** of the "Zero to Hero" educational project. It showcases a production-ready, single-process **Monolithic REST API**.
>
> The project has since evolved into a Distributed Microservices Architecture using a Monorepo.
> **[Check out Phase 2: Microservices Repository here](https://github.com/Olena-Muliarchuk/nest-microservices-monorepo)**

This is an educational project designed to guide a developer from "Hello World" to **Skilled backend developer** using the **NestJS** framework.

I'm building a **RESTful API for a Music Streaming Platform**, where users can browse a catalog of songs and artists, while administrators manage the content. The project emphasizes **Clean Architecture**, **Best Practices**, **Security**, and **Scalability**.

---

## 🛠 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (Modular Architecture)
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL (via Docker)
- **ORM:** TypeORM (Entities, Relations, QueryBuilder, Migrations)
- **Security & Auth:** JWT, Passport, BCrypt, Custom Guards (RBAC & Ownership), Helmet (HTTP Headers), CORS
- **Rate Limiting:** `@nestjs/throttler` (Anti-DDoS protection)
- **Validation:** `class-validator`, `class-transformer`, Zod (for Environment Variables)
- **Caching:** Redis (via Keyv & Custom HTTP Cache Interceptor)
- **Scheduling:** `@nestjs/schedule` (Automated data cleanup)
- **API Documentation:** Swagger / OpenAPI
- **File Management:** Multer, `@nestjs/serve-static` (Local fallback)
- **Cloud Storage:** AWS SDK v3 (S3 API) / MinIO
- **Background Processing:** BullMQ (Redis-backed queues), `music-metadata`
- **Real-time Communication:** WebSockets. Hybrid approach (`@nestjs/websockets`, Socket.IO for events, REST/GraphQL for data transfer)
- **Environment:** Docker Compose
- **GraphQL API:** Code-First approach, Apollo Server, DataLoaders (N+1 optimization), Query Complexity

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

Start the PostgreSQL, Redis, and MinIO containers:

```bash
docker-compose up -d
```

### 4. Environment Configuration

Create a `.env` file in the root directory. You can use the example below:

```env
# Application
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nest_db

# Security (JWT)
JWT_SECRET=SuperSecretKey123!
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=SuperSecretRefreshKey!
JWT_REFRESH_EXPIRATION=7d

# Caching (Redis)
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloud Storage (S3 / MinIO)
AWS_S3_REGION=us-east-1
AWS_S3_ENDPOINT=http://localhost:9000
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_S3_BUCKET_NAME=nest-music-uploads
```

### 5. Running the App

```bash
# Run database migrations
npm run migration:run

# Seed the database with dummy data (Artists & Songs)
npm run seed

# Watch mode (Development)
npm run start:dev

# Production mode
npm run start:prod

```

Once running, access the **Swagger API Documentation** at: `http://localhost:3000/api`

---

## 🗺 Roadmap & Progress

This repository implements **Blocks 1–7** of a "Zero to Hero" NestJS mastery roadmap - covering all monolithic foundations from basic architecture to E2E testing.

### 🟢 Block 1: Foundations

* [x] CLI, Project Structure, `main.ts` setup
* [x] **Controllers:** Routing, Request Handling (`@Body`, `@Query`, `@Param`)
* [x] **Providers:** Services, Dependency Injection (DI)
* [x] **Modules:** Modular Architecture, imports/exports features
* [x] **Middleware:** Global HTTP Request Logging
* [x] **Exception Filters:** Global unified error handling format
* [x] **Network Security:** Helmet (HTTP header protection) & CORS configuration

### 🟢 Block 2: Data & Validation

  * [x] **Pipes:** `ValidationPipe` (whitelist, forbidNonWhitelisted), `ParseIntPipe`
  * [x] **DTOs:** Input validation using `class-validator`
  * [x] **Serialization:** Response transformation (`@Exclude` password) using `ClassSerializerInterceptor`

### 🟢 Block 3: Database & ORM

  * [x] **TypeORM Setup:** PostgreSQL connection
  * [x] **Entities & Relations:** One-to-Many & Many-to-Many (Playlists \<-\> Songs \<-\> Artists)
  * [x] **Migrations:** Database version control (Current status: `synchronize: false`)
  * [x] **Pagination:** Implementing `nestjs-typeorm-paginate`
  * [x] **QueryBuilder:** Complex case-insensitive search and dynamic filtering
  * [x] **Transactions:** Ensuring data consistency (e.g., Playlist creation)
  * [x] **Soft Deletes:** `@DeleteDateColumn` and data restoration
  * [x] **Performance:** Database Indexing (Composite and Single-column indices)

### 🟢 Block 4: Security & Auth

* [x] **Users Module:** User creation & password hashing (`bcrypt`)
* [x] **Authentication:** Login logic & JWT generation
* [x] **JWT Strategy:** Passport integration, Bearer Token validation
* [x] **Guards:** Protecting routes with `AuthGuard`
* [x] **Rate Limiting:** Global API protection against brute-force using `ThrottlerGuard`
* [x] **Custom Decorators:** `@User()` & `@Roles()` decorators
* [x] **Authorization (RBAC):** `Admin` vs `User` roles, `RolesGuard`
* [x] **Ownership Logic:** `PlaylistOwnerGuard` protecting user-specific resources

### 🟢 Block 5: Advanced Patterns

* [x] **ConfigModule:** Environment validation with **Zod**
* [x] **Standalone Applications:** Custom Database Seeder (`npm run seed`)
* [x] **File Processing:** Handling audio/image files with Multer (`AdminController`)
* [x] **Static Files:** Serving local assets via `ServeStaticModule`
* [x] **Refresh Tokens:** Secure token rotation
* [x] **Caching:** Redis integration with Custom Interceptors
* [x] **Task Scheduling:** Cron jobs (e.g., automated GDPR-compliant cleanup of soft-deleted users)
* [x] **Cloud Storage:** AWS S3 / MinIO integration (Presigned URLs)
* [x] **Asynchronous Processing (Queues):** BullMQ & Redis integration for heavy tasks
* [x] **WebSockets:** Real-time communication (Gateway, Socket.IO)

### 🟢 Block 6: Testing & DevOps

  * [x] **Unit Testing:** Jest, mocking services/repositories, stream memory management
  * [x] **E2E Testing:** Supertest, dockerized test DB, overriding providers
  * [x] **Documentation:** Swagger/OpenAPI (`@ApiTags`, `@ApiOperation`)
  * [x] **Docker:** Multi-stage production builds, internal networking, healthchecks
  * [x] **Database Migrations in Prod:** Compiling migrations for Docker execution

### 🟢 Block 7: GraphQL Integration (Hybrid Architecture)

* [x] **Code-First Schema:** Generating GraphQL schema using TypeScript classes and `@nestjs/graphql`.
* [x] **Queries & Mutations:** CRUD operations for the music catalog.
* [x] **Performance Optimization:** Solving the classic N+1 problem using `DataLoader` for relational data.
* [x] **Context & Security:** Adapting REST-based JWT Guards and Custom Decorators to the GraphQL Execution Context.
* [x] **Error Handling:** Custom Global Exception Filter to map `HttpException` to `GraphQLError` formats.
* [x] **Pagination & Filtering:** Implementing reusable `ArgsType` for complex, paginated queries.
* [x] **Query Complexity:** Protecting the database from deeply nested DoS queries using `graphql-query-complexity`.

-----

### ⏭️ Block 8: Microservices Evolution (Moved to Phase 2)

*Development of the API Gateway, Monorepo workspace (`apps/` & `libs/`), TCP microservices, and event-driven architecture has been moved to a dedicated repository.*
 **[Follow the Microservices Journey here](https://github.com/Olena-Muliarchuk/nest-microservices-monorepo)**

### ⏭️ Block 9: Enterprise Patterns, Resilience & Observability (Planned for Phase 3)

*Advanced topics like Circuit Breakers, Distributed Tracing, Health Checks, and CQRS will be implemented in the microservices monorepo.*

---

## 📂 Project Structure

```bash
src/
├── app.module.ts        # Root Module
├── main.ts              # Entry Point
├── env.validation.ts    # Zod Schema for .env validation
├── config/              # Centralized configs (TypeORM, Redis)
├── auth/                # Security (JWT, Strategies, Guards)
├── users/               # User Management
├── songs/               # Catalog (Search, Pagination, Presigned URLs)
├── playlists/           # Playlists (Transactions, Ownership)
├── audio/               # BullMQ Producer & Worker (Metadata extraction)
├── storage/             # AWS S3 / MinIO integration
├── events/              # WebSocket Gateway (Real-time events)
├── admin/               # Admin specific tasks (File Uploads)
├── db/migrations/       # TypeORM Migrations
└── common/              # Shared Utilities (Filters, Interceptors)
```

---

## 👤 Author

This project is built as part of an intensive **NestJS Mentorship Program**.
