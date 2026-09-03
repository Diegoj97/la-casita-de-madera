<div align="center">
  <h1 align="center">La Casita de Madera</h1>
  <p align="center">
    <strong>A self-managed platform combining a photography portfolio and an apiculture product store</strong>
  </p>
  <p align="center">
    <strong>Author:</strong> Diego José Gutiérrez Cano<br>
    <strong>GitHub & edX Username:</strong> <a href="https://github.com/Diegoj97">Diegoj97</a><br>
    <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/diego-jose-gutierrez-cano-9b5719168/">Diego José Gutiérrez Cano</a><br>
    <strong>Location:</strong> Madrid, Spain<br>
    <strong>Date:</strong> September 3, 2026<br>
    <strong>Live Demo:</strong> <a href="https://la-casita-de-madera.netlify.app/">https://la-casita-de-madera.netlify.app/</a>
  </p>
  <p align="center">
    <a href="#description">Description</a> •
    <a href="#features">Features</a> •
    <a href="#technologies">Technologies</a> •
    <a href="#project-architecture">Architecture</a> •
    <a href="#design-choices">Design Choices</a> •
    <a href="#local-installation">Installation</a>
  </p>
</div>

---

#### Video Demo: <https://youtu.be/M4QHCxh5SMM>

## Description

**La Casita de Madera** is a custom-built full-stack web application designed to address a real-world professional requirement: providing a local photographer and beekeeper (Sergio) with a fully self-managed platform that integrates his visual portfolio with the direct commercialization of his apiculture products and professional services. 

The project was created to consolidate a high-quality photography showcase and a dynamic commercial notice board into a single space, functioning simultaneously as an artistic portfolio and a direct sales channel for honey and photography services.

Functionally, the platform stands out for its flexibility and its focus on **complete autonomy without technical dependencies**. It features a secure authentication system based on user credentials that grants the administrator access to a private control panel. From this Content Management System (CMS) interface, the user can modify text and images across any section in real time, publish new product or service listings, and upload photographic material instantly.

The project is currently deployed in production and accessible globally at [la-casita-de-madera.netlify.app](https://la-casita-de-madera.netlify.app/), allowing public visitors to explore the catalog and portfolio, while the administrator seamlessly manages updates from the backend.

## Features

- **Dynamic Portfolio**: High-quality image gallery with optimized loading.
- **Product Catalog**: Commercial notice board for selling honey and professional photography services.
- **Custom CMS**: Private interface protected by JWT authentication, allowing the administrator to manage all website content without altering the source code.
- **Cloud Storage**: Cloudinary integration for efficient image uploading, automatic optimization, and fast content delivery.
- **Responsive Design**: User interface (UX/UI) fully adapted for mobile, tablet, and desktop devices.
- **Optimized Performance**: Frontend built as a Single Page Application (SPA) to ensure seamless navigation without page reloads.

## Technologies

**Frontend (Client)**
- **Angular 21**: Framework utilized for the core architecture, leveraging TypeScript, Reactive Forms, and Route Guards.
- **Tailwind CSS (v4)**: Utility-first CSS framework for efficient and consistent interface styling.

**Backend (Server)**
- **Node.js & Express.js**: RESTful API built with TypeScript.
- **PostgreSQL**: Relational database for structured data persistence.
- **JWT (JSON Web Tokens)**: Secure administrator authentication system.
- **Cloudinary & Multer**: Multimedia file management and upload handling.
- **Helmet & CORS**: Security middlewares for HTTP header protection and resource sharing.

## Project Architecture

The repository is structured under a decoupled client-server architecture to ensure a clean separation of concerns, long-term maintainability, and scalability:

### `la-casita-de-madera-app/` (Frontend)
Developed in Angular (v21) with TypeScript and styled using Tailwind CSS. This directory handles client-side rendering, visual state management, and SPA navigation.

- **`src/app/components/`**: Contains reusable UI components, divided into public views (photo gallery, catalog, contact) and private views (login and CMS panel).
- **`src/app/services/`**: Angular services responsible for executing HTTP requests to the backend, managing authentication token persistence, and handling session states.
- **`src/app/guards/`**: Navigation guards to protect private CMS routes, strictly blocking unauthenticated access.

### `la-casita-de-madera-api/` (Backend)
Built on Node.js and Express.js, acting as a RESTful API that processes client requests, executes business logic, and validates security protocols.

- **`src/routes/`**: Defines API endpoints categorized by module (authentication, content management, catalog, and media).
- **`src/controllers/`**: Contains the CRUD business logic associated with each route.
- **`src/middlewares/`**: Handles JWT verification and role-based permission validation for sensitive requests.
- **`src/services/`**: Manages the integration with cloud storage services for uploading and optimizing images sent from the admin panel.
- **`src/db/`**: Database connection logic and initial seeding scripts.

## Design Choices

Throughout the design and development process, foundational technical decisions were made to ensure robustness, performance, and an optimal user experience:

1. **Angular for the Frontend:** The Angular ecosystem was selected due to its component-based architecture, strict typing via TypeScript, and native dependency injection. This ensures the construction of a modular, highly maintainable interface that minimizes runtime errors when manipulating complex data structures.
2. **Full-Stack Decoupling (REST API):** Keeping the web client entirely independent of the Node.js API facilitates isolated development and testing environments. This separation of concerns also ensures that the API can be consumed by other platforms (such as a future mobile application) without requiring backend logic rewrites.
3. **Custom Self-Managed CMS:** Developing a proprietary control panel was prioritized over utilizing third-party monolithic solutions (like WordPress). This approach allows the administrative experience to be tailored entirely to the specific needs of a non-technical end user, eliminating operational barriers and recurring maintenance costs.
4. **Cloud Media Storage:** To prevent server saturation and guarantee the rapid delivery of high-resolution images—a critical requirement for a photography portfolio—Cloudinary was integrated. This offloads multimedia processing, enabling automatic format and size optimization directly in the cloud.

## Local Installation

To run the project on your local environment, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) installed and running
- A free [Cloudinary](https://cloudinary.com/) account (for image management)

### 1. Clone the repository
```bash
git clone [https://github.com/Diegoj97/la-casita-de-madera.git](https://github.com/Diegoj97/la-casita-de-madera.git)
cd "la casita de madera"
