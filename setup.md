# TechnoClub Authentication Setup Guide

This project uses NextAuth.js with MongoDB for authentication. Follow these steps to get started:

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_replace_this_with_a_strong_random_value

# MongoDB
MONGODB_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/techno-club

# Google Provider
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Navigate to "APIs & Services" > "Credentials".
4. Create OAuth client ID credentials.
5. Configure the consent screen (choose External).
6. Add the following authorized redirect URI: `http://localhost:3000/api/auth/callback/google`.
7. Copy the Client ID and Client Secret to your `.env` file.

## Install Dependencies

Run the following command to install the required packages:

```bash
pnpm install
```

## Run the Development Server

```bash
pnpm dev
```

## Authentication Features

The app includes:

- User sign-up and sign-in pages
- Google OAuth authentication
- Role-based access control with four roles:
  - `user`: Default role for new registrations
  - `member`: Higher privileges for club members
  - `admin`: Administrative access
  - `superadmin`: Full system access

## Role-Based Access

The middleware restricts access to certain routes based on user roles:

- `/dashboard`: Accessible to all authenticated users
- `/dashboard/admin`: Accessible to `admin` and `superadmin` roles
- `/dashboard/superadmin`: Accessible only to `superadmin` role

## Database Connection

The application connects to MongoDB using both the MongoDB driver (for NextAuth adapter) and Mongoose (for data models and queries). 