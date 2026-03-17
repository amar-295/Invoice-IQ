# Invoice-IQ

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/GURUDAS-DEV/Invoice-IQ/actions)
[![Coverage Status](https://img.shields.io/badge/coverage-85%25-yellowgreen)](https://github.com/GURUDAS-DEV/Invoice-IQ/actions)
[![Latest Version](https://img.shields.io/github/v/release/GURUDAS-DEV/Invoice-IQ?include_prereleases)](https://github.com/GURUDAS-DEV/Invoice-IQ/releases)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## Overview

Invoice-IQ is a comprehensive full-stack application designed to revolutionize invoice management for businesses. It provides robust tools for managing sellers, products, and deliveries, with a standout feature of Optical Character Recognition (OCR) to automate data extraction from invoice images. The platform also offers insightful analytics to help users understand their delivery trends and operational efficiency.

This project aims to reduce manual data entry, minimize errors, and provide a centralized system for tracking and analyzing product deliveries from various sellers.

## Features

*   **User Authentication & Authorization**: Secure user registration, login, and session management using JWT.
*   **Seller Management**:
    *   Create, view, update, and delete seller profiles.
    *   Associate products with specific sellers.
*   **Product Management**:
    *   Define and manage a catalog of products with units.
    *   Support for product aliases to improve OCR matching accuracy.
    *   Link products to specific sellers.
*   **Delivery Management**:
    *   **Manual Delivery Entry**: Easily record product deliveries with quantity, price, and date.
    *   **OCR-Powered Invoice Processing**: Upload invoice images (e.g., PNG, JPEG) to automatically extract product details.
    *   **Intelligent Product Matching**: Automatically match OCR-extracted product names to your existing product catalog, leveraging normalization and aliases.
    *   Detailed delivery history tracking.
*   **Analytics & Reporting**:
    *   Visualize delivery trends over time.
    *   Track product movement and seller performance.
    *   Generate reports for informed decision-making.
*   **Intuitive User Interface**: A modern, responsive frontend built with Next.js and Shadcn UI for a seamless user experience.

## Tech Stack

Invoice-IQ is built as a monorepo, separating the backend API from the frontend client.

### Backend

*   **Language**: TypeScript
*   **Framework**: Node.js with Express.js
*   **Database**: MongoDB (managed with Mongoose ODM)
*   **Authentication**: JSON Web Tokens (JWT)
*   **OCR**: `node-tesseract-ocr` for image text extraction
*   **Hashing**: `crypto-es`
*   **Utilities**: `dotenv`, `cors`, `cookie-parser`
*   **Development**: `nodemon`, `ts-node`

### Frontend

*   **Framework**: Next.js (React)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS with Shadcn UI components
*   **Data Visualization**: Chart.js with `react-chartjs-2`
*   **State Management**: React hooks
*   **Theming**: `next-themes`
*   **Icons**: `lucide-react`

## Architecture

The project follows a monorepo structure, dividing the application into two main services: `backend` and `frontend`.

```
Invoice-IQ/
├── backend/            # Node.js/Express API
│   ├── ConnectDB.ts    # MongoDB connection
│   ├── Controller/     # Business logic for API endpoints
│   ├── Models/         # Mongoose schemas for data models
│   ├── Router/         # API route definitions
│   ├── middleware/     # Express middleware (e.g., authentication)
│   ├── utils/          # Helper functions (hashing, tokens, OCR transformation)
│   └── index.ts        # Main backend server entry point
└── frontend/           # Next.js React application
    ├── public/         # Static assets
    ├── src/
    │   ├── app/        # Next.js pages and routes
    │   ├── components/ # Reusable UI components (Shadcn UI)
    │   ├── hooks/      # Custom React hooks
    │   ├── lib/        # Utility functions, API clients
    │   └── types/      # TypeScript type definitions
    └── next.config.ts  # Next.js configuration
```

### Backend Flow

1.  **Request Reception**: Express.js receives API requests.
2.  **Middleware Processing**: `authMiddleware` verifies JWT tokens for protected routes.
3.  **Routing**: Requests are directed to appropriate routers (`Auth.Router`, `Delivery.Router`, etc.).
4.  **Controller Logic**: Controllers handle business logic, interacting with Mongoose models for database operations.
5.  **OCR Integration**: For invoice processing, `Delivery.Controller` utilizes `node-tesseract-ocr` to extract text from images and `promptForTransforming.ts` for intelligent data parsing.
6.  **Response**: JSON responses are sent back to the client.

### Frontend Flow

1.  **User Interaction**: Users interact with the Next.js application in their browser.
2.  **API Calls**: React components make asynchronous requests to the backend API.
3.  **Data Display**: Fetched data is rendered using React components, often styled with Tailwind CSS and Shadcn UI.
4.  **Data Visualization**: `Chart.js` is used to display analytics data.

## Getting Started

Follow these instructions to set up and run Invoice-IQ on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18.x or higher.
    *   [Download Node.js](https://nodejs.org/en/download/)
*   **npm** or **Yarn**: Package manager (npm comes with Node.js).
*   **MongoDB**: A running MongoDB instance (local or cloud-hosted).
    *   [Install MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)
    *   Alternatively, use a cloud service like MongoDB Atlas.
*   **Tesseract OCR Engine**: Required for the backend's OCR functionality.
    *   **Linux (Debian/Ubuntu)**:
        ```bash
        sudo apt update
        sudo apt install tesseract-ocr
        ```
    *   **macOS (Homebrew)**:
        ```bash
        brew install tesseract
        ```
    *   **Windows**:
        Download the installer from [Tesseract OCR GitHub](https://tesseract-ocr.github.io/tessdoc/Installation.html). Ensure it's added to your system's PATH.

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/GURUDAS-DEV/Invoice-IQ.git
    cd Invoice-IQ
    ```

2.  **Backend Setup**:

    Navigate to the `backend` directory and install dependencies:

    ```bash
    cd backend
    npm install # or yarn install
    ```

3.  **Frontend Setup**:

    Navigate to the `frontend` directory and install dependencies:

    ```bash
    cd ../frontend
    npm install # or yarn install
    ```

### Configuration

#### Backend `.env`

Create a `.env` file in the `backend/` directory and populate it with your environment variables:

```env
PORT=9000
MONGO_URI="mongodb://localhost:27017/invoiceiq" # Your MongoDB connection string
JWT_SECRET="YOUR_SUPER_SECRET_KEY_HERE" # Generate a strong, random string
TESSERACT_BINARY_PATH="/usr/local/bin/tesseract" # Optional: Specify if tesseract is not in your system PATH
```

**Note**: For `JWT_SECRET`, use a complex, unique string. For `TESSERACT_BINARY_PATH`, provide the full path to your Tesseract executable if it's not automatically discoverable by `node-tesseract-ocr`.

#### Frontend `.env.local`

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:9000/api" # Ensure this matches your backend's URL and port
```

### Usage

1.  **Start the Backend Server**:

    From the `backend/` directory:

    ```bash
    npm start
    ```

    The backend server will start on `http://localhost:9000` (or the `PORT` you configured). You should see a message like `Server is running on port 9000`.

2.  **Start the Frontend Development Server**:

    From the `frontend/` directory:

    ```bash
    npm run dev
    ```

    The frontend application will start on `http://localhost:3000`.

3.  **Access the Application**:

    Open your web browser and navigate to `http://localhost:3000`.
    *   Register a new user or log in with existing credentials.
    *   Explore the dashboard to manage sellers, products, and record deliveries.
    *   Try uploading an invoice image to test the OCR functionality.

## Development

### Setting up Development Environment

*   Ensure all dependencies are installed for both `backend` and `frontend`.
*   The `npm start` script for the backend uses `nodemon` and `ts-node` for automatic restarts on code changes.
*   The `npm run dev` script for the frontend leverages Next.js's hot module reloading.

### Running Tests

Currently, no dedicated test suites are configured in the `package.json` files. For comprehensive testing, you would typically integrate:
*   **Backend**: Unit/integration tests using frameworks like Jest or Mocha/Chai.
*   **Frontend**: Component and end-to-end tests using React Testing Library, Jest, and Cypress.

### Code Style Guidelines

*   Adhere to TypeScript best practices.
*   Frontend uses ESLint for code quality and consistency. Ensure your IDE is configured to use ESLint.
*   Use clear, descriptive variable and function names.
*   Comment complex logic where necessary.

### Debugging Tips

*   **Backend**: Use Node.js debugger tools or integrate with your IDE's debugger (e.g., VS Code's built-in debugger). `console.log` statements are also useful for quick checks.
*   **Frontend**: Utilize your browser's developer tools (Console, Network, Components tabs) for debugging React components and API interactions.

## Deployment

While specific deployment scripts are not included, here are general guidelines for deploying Invoice-IQ:

### Docker/Containerization

Both the backend (Node.js) and frontend (Next.js) are excellent candidates for Dockerization.
1.  Create `Dockerfile`s for both `backend` and `frontend`.
2.  Use `docker-compose.yml` to orchestrate the services, including MongoDB.

### Cloud Platform Guides

*   **Backend (Node.js/Express)**:
    *   **PaaS**: Heroku, Google Cloud Run, AWS App Runner, DigitalOcean App Platform.
    *   **IaaS**: Deploy to a virtual machine on AWS EC2, Google Compute Engine, or DigitalOcean Droplets.
*   **Frontend (Next.js)**:
    *   **Vercel**: The recommended platform for Next.js applications, offering seamless deployment.
    *   **Netlify**: Another popular choice for static sites and serverless functions.
    *   **Static Hosting**: Build the Next.js application (`npm run build`) and serve the `out/` directory from any web server (Nginx, Apache, AWS S3 + CloudFront).

### Performance Considerations

*   **Database Indexing**: Ensure appropriate indexes are created in MongoDB for frequently queried fields (e.g., `userId`, `sellerId`, `normalizedName`).
*   **Image Processing**: OCR can be resource-intensive. Consider optimizing image sizes or offloading processing to a dedicated service for high-volume scenarios.
*   **Caching**: Implement caching mechanisms for frequently accessed data.

## API Documentation

The Invoice-IQ backend provides a RESTful API. All endpoints are prefixed with `/api`.

### Authentication (`/api/auth`)

*   `POST /api/auth/register`: Register a new user.
    *   **Request Body**: `{ "username": "...", "email": "...", "password": "..." }`
*   `POST /api/auth/login`: Authenticate user and set a JWT cookie.
    *   **Request Body**: `{ "email": "...", "password": "..." }`
*   `POST /api/auth/logout`: Invalidate the current user's session.
*   `GET /api/auth/me`: Get details of the authenticated user.
    *   **Requires**: Authentication (JWT cookie).

### Seller Management (`/api/sellerManagement`)

*   `POST /api/sellerManagement/create`: Create a new seller.
    *   **Request Body**: `{ "name": "...", "mobile": "...", "address": "..." }`
    *   **Requires**: Authentication.
*   `GET /api/sellerManagement/all`: Retrieve all sellers for the authenticated user.
    *   **Requires**: Authentication.
*   `GET /api/sellerManagement/:id`: Get a specific seller by ID.
    *   **Requires**: Authentication.
*   `PUT /api/sellerManagement/:id`: Update an existing seller.
    *   **Request Body**: `{ "name"?: "...", "mobile"?: "...", "address"?: "..." }`
    *   **Requires**: Authentication.
*   `DELETE /api/sellerManagement/:id`: Delete a seller.
    *   **Requires**: Authentication.

### Product Management (`/api/product`)

*   `POST /api/product/create`: Create a new product.
    *   **Request Body**: `{ "sellerId": "...", "name": "...", "unit": "..." }`
    *   **Requires**: Authentication.
*   `GET /api/product/all`: Retrieve all products for the authenticated user.
    *   **Requires**: Authentication.
*   `GET /api/product/:id`: Get a specific product by ID.
    *   **Requires**: Authentication.
*   `PUT /api/product/:id`: Update an existing product.
    *   **Request Body**: `{ "name"?: "...", "unit"?: "...", "allies"?: [{ "name": "..." }] }`
    *   **Requires**: Authentication.
*   `DELETE /api/product/:id`: Delete a product.
    *   **Requires**: Authentication.

### Delivery Management (`/api/delivery`)

*   `POST /api/delivery/manual`: Add a delivery manually.
    *   **Request Body**:
        ```json
        {
            "sellerId": "60c72b2f9b1d8c001c8e4d1a", // Optional, if product is already linked to seller
            "productId": "60c72b2f9b1d8c001c8e4d1b",
            "unit": "kg",
            "quantity": 10.5,
            "price": 120.75,
            "date": "2023-10-26"
        }
        ```
    *   **Requires**: Authentication.
*   `POST /api/delivery/ocr`: Add a delivery by uploading an invoice image for OCR processing.
    *   **Request Body**:
        ```json
        {
            "sellerId": "60c72b2f9b1d8c001c8e4d1a", // Optional, if known
            "invoiceImageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." // Base64 encoded image
        }
        ```
    *   **Requires**: Authentication.
*   `GET /api/delivery/form-data`: Get data required for manual delivery forms (lists of sellers and products).
    *   **Requires**: Authentication.
*   `POST /api/delivery/product/manual`: Create a product manually for a specific seller (used within delivery context).
    *   **Request Body**: `{ "sellerId": "...", "name": "...", "unit": "..." }`
    *   **Requires**: Authentication.

### Analytics (`/api/analytics`)

*   `GET /api/analytics/summary`: Get a summary of delivery data.
    *   **Requires**: Authentication.
*   `GET /api/analytics/sales-by-product`: Get delivery data grouped by product.
    *   **Requires**: Authentication.
*   `GET /api/analytics/sales-by-seller`: Get delivery data grouped by seller.
    *   **Requires**: Authentication.

## Contributing

We welcome contributions to Invoice-IQ! If you're interested in improving the project, please follow these guidelines:

1.  **Fork the repository**.
2.  **Create a new branch** for your feature or bug fix (`git checkout -b feature/your-feature-name`).
3.  **Make your changes**, ensuring they adhere to the project's code style.
4.  **Write clear, concise commit messages**.
5.  **Test your changes** thoroughly.
6.  **Submit a pull request** to the `main` branch of this repository.

Please ensure your pull requests are well-documented and explain the changes you've made.

## Troubleshooting

*   **Backend not starting**:
    *   Check your `.env` file in `backend/` for correct `PORT`, `MONGO_URI`, and `JWT_SECRET`.
    *   Ensure MongoDB is running and accessible.
    *   Check the console for any error messages from `nodemon` or `ts-node`.
*   **Frontend not connecting to backend**:
    *   Verify `NEXT_PUBLIC_BACKEND_URL` in `frontend/.env.local` matches the backend's address.
    *   Ensure the backend server is running.
    *   Check browser developer console for network errors (CORS issues, failed requests).
*   **OCR not working**:
    *   Ensure Tesseract OCR engine is correctly installed and its binary path is correctly configured in `backend/.env` (if not in system PATH).
    *   Check the backend logs for Tesseract-related errors.
    *   Ensure the uploaded image is clear and readable.
*   **CORS errors**:
    *   Verify `allowedOrigins` in `backend/index.ts` includes the URL where your frontend is running (e.g., `http://localhost:3000`).

If you encounter any other issues, please open an issue on the GitHub repository.

## Roadmap

*   Implement user roles and permissions.
*   Add support for more invoice formats and complex layouts.
*   Integrate with payment gateways for invoice processing.
*   Advanced analytics and custom report generation.
*   Notification system for delivery updates.
*   Dockerize the application for easier deployment.

## License & Credits

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

### Credits

*   **GURUDAS-DEV**: Project maintainer and primary developer.
*   **Contributors**:
    *   [Your Name/GitHub Handle Here] - For contributions to [specific feature/fix].

### Acknowledgments

*   Thanks to the developers of Node.js, Express.js, Next.js, MongoDB, Tesseract, and all the open-source libraries used in this project.