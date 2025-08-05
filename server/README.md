# CHAMP - Functional Backend Server

This directory contains a functional backend server built with Node.js and Express. It has been upgraded from an in-memory example to a persistent backend.

## Features

- **Persistent Database**: Uses **SQLite**, a file-based database, to store all application data. Data is saved in a `database.sqlite` file and persists across server restarts.
- **Real File Uploads**: The `/api/upload` endpoint now handles base64 image uploads, decodes them, and saves them as actual image files in the `public/uploads` directory.
- **Token-based Authentication**: Secure endpoints using JSON Web Tokens (JWT).

## How to Run

1.  **Navigate to this directory:**
    Open your terminal and change into this `server` directory.
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    You'll need Node.js and npm installed on your machine. Run the following command to install the necessary packages.
    ```bash
    npm install
    ```

3.  **Start the server:**
    This command will start the server. The first time you run it, it will create and set up `database.sqlite` and the `public/uploads` directory. By default, it runs on port 3001.
    ```bash
    npm start
    ```

You should see a message in your terminal: `Server is running on port 3001`. Now, the frontend application will be able to communicate with a real, persistent backend.

## Next Steps for Production

-   **Password Hashing**: In `database.js`, user passwords are currently stored in plain text. For a real production environment, you **must** hash and salt passwords using a library like `bcrypt`.
-   **Database Scaling**: SQLite is excellent for getting started, but for a large-scale application, consider migrating to a more robust database server like PostgreSQL or MySQL.
-   **Cloud Storage**: For better scalability and reliability, consider moving file uploads from the local server filesystem to a cloud storage service like AWS S3 or Google Cloud Storage.
-   **Environment Variables**: Move sensitive data like the `JWT_SECRET` into a `.env` file and use a library like `dotenv` to manage them.