# POS Fullstack Application

This project is a full-stack point-of-sale (POS) application developed using Express.js for the backend and React.js for the frontend. The application features an admin dashboard with a sidebar, header, footer, and content areas for managing customers, products, and transactions.

## Demo
https://github.com/user-attachments/assets/5a2349b8-5e91-4caa-a71d-d8945b69375c

## Features

- **Customer Management:** Create, read, update, and delete customers.
- **Product Management:** Manage product inventory.
- **Transaction Management:** Track and manage sales transactions.
- **Admin Dashboard:** A responsive dashboard layout with sidebar navigation.

## Tech Stack

### Backend

- **Express.js:** A minimal and flexible Node.js web application framework.
- **PostgreSQL:** A powerful, open-source object-relational database system.
- **Node.js:** JavaScript runtime built on Chrome's V8 JavaScript engine.

#### Backend Dependencies

```json
"dependencies": {
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.19.2",
  "pg": "^8.12.0"
}
```
### Frontend

- **React.js:** A JavaScript library for building user interfaces.
- **Redux Toolkit:** A toolset for efficient Redux development.
- **Ant Design:** A React UI library for enterprise-level products.
- **Axios:** A promise-based HTTP client for the browser and Node.js.
- **React Router:** Declarative routing for React.js applications.

## Frontend Dependencies

```json
"dependencies": {
  "@reduxjs/toolkit": "^2.2.7",
  "antd": "^5.20.2",
  "axios": "^1.7.5",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-redux": "^9.1.2",
  "react-router-dom": "^6.26.1"
}
```
# Project Structure

## Backend (`pos-backend`)

- **migrations/**: Database migration scripts.
  - `create_customers_table.js`: Migration for creating the customers table.
  - `create_products_table.js`: Migration for creating the products table.
  - `create_transactions_table.js`: Migration for creating the transactions table.
  - `create_transaction_items_table.js`: Migration for creating transaction items.

- **routes/**: Express.js route handlers.
  - `customers.js`: Routes for customer operations.
  - `products.js`: Routes for product operations.
  - `transactions.js`: Routes for transaction operations.

- **seeder/**: Database seeding scripts.
  - `seed_customers.js`: Script for seeding customers data.
  - `seed_products.js`: Script for seeding products data.

- **runner/**: Script to run migrations.
  - `run_migrations.js`: Script to execute all migrations.

- `app.js`: Main Express.js application file.
- `db.js`: Database connection configuration.

## Frontend (`pos-frontend`)

- **src/**
  - **components/Layout**: Layout components for the dashboard.
    - `Header.jsx`: Header component.
    - `Footer.jsx`: Footer component.
    - `Sidebar.jsx`: Sidebar navigation component.
    - `Layout.jsx`: Main layout wrapper.
  - **Pages**: Page components for different features.
    - **Customer**: Components related to customer management.
      - `CustomerDetail.jsx`: Customer detail view.
      - `CustomerTable.jsx`: Table for displaying customer data.
    - **Products**: Components related to product management.
      - `ProductDetail.jsx`: Product detail view.
      - `ProductTable.jsx`: Table for displaying product data.
    - **Transactions**: Components related to transaction management.
      - `TransactionDetail.jsx`: Transaction detail view.
      - `TransactionTable.jsx`: Table for displaying transaction data.
  - **features/**: Redux slices for state management.
    - `breadCrumbSlice.js`: Slice for managing breadcrumb state.
    - `customersSlice.js`: Slice for managing customer state.
    - `productSlice.js`: Slice for managing product state.
    - `transactionSlice.js`: Slice for managing transaction state.
  - **store/**: Redux store configuration.
    - `store.js`: Main Redux store setup.
  - `api.js`: API service configuration.
  - `App.jsx`: Main entry point for the React application.

## Getting Started

### API Doc Postman
https://documenter.getpostman.com/view/30348262/2sAXjF9EzU

### Prerequisites

- Node.js
- PostgreSQL

# Backend Setup

1. Clone the repository and navigate to the `pos-backend` directory:

    ```bash
    git clone <repository-url>
    cd pos-backend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Configure the environment variables:

   - Create a `.env` file in the `pos-backend` directory with the following content:

    ```env
    DATABASE_URL=postgres://user:password@localhost:5432/posdb
    ```

4. Run the database migrations:

    ```bash
    node runner/run_migrations.js
    ```

5. Seed the database (optional):

    ```bash
    node seeder/seed_customers.js
    node seeder/seed_products.js
    ```

6. Start the backend server:

    ```bash
    npm start
    ```

# Frontend Setup

1. Navigate to the `pos-frontend` directory:

    ```bash
    cd ../pos-frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

# Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# License

This project is licensed under the MIT License.
