# Healthily-User

Healthily-User is a Next.js web application designed to connect patients with healthcare professionals. It offers features like teleconsultation, appointment booking, doctor search, and prescription management, aiming to make healthcare services more accessible and efficient.

## Overview

This application serves as the user-facing frontend for the Healthily platform. Patients can search for doctors based on specialization, view doctor profiles, book teleconsultation slots or in-person appointments, and manage their prescriptions. The platform leverages real-time communication for teleconsultations and provides a seamless booking experience.

## Key Features

*   **Doctor Search & Discovery:**
    *   Browse doctors by specialization.
    *   Filter doctors based on various criteria (e.g., location - though search by location UI is present, backend logic might be needed).
    *   View detailed doctor profiles including experience, clinic, fees, and a personal message.
*   **Appointment Booking:**
    *   **Teleconsultation:** Book real-time video consultations. Includes a patient details form, QR code payment simulation, and a waiting room experience with real-time status updates via Socket.IO.
    *   **In-Clinic Appointments:** Book traditional appointments by selecting available dates and time slots.
*   **Video Consultations:** Integrated video call functionality using ZegoCloud for one-on-one sessions between patients and doctors.
*   **Prescription Management:** View and access digital prescriptions.
*   **Email Notifications:** Automated email confirmations for booked appointments using Resend.
*   **Responsive Design:** User-friendly interface accessible on various devices.

## Tech Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (with App Router)
    *   [React](https://reactjs.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [Shadcn UI](https://ui.shadcn.com/) (for UI components)
*   **Real-time Communication:**
    *   [Socket.IO Client](https://socket.io/docs/v4/client-api/) (for teleconsultation booking status)
    *   [ZegoCloud UIKit Prebuilt](https://www.zegocloud.com/) (for video call functionality)
*   **API Communication:** [Axios](https://axios-http.com/)
*   **Email Service:** [Resend](https://resend.com/)
*   **Styling & UI:**
    *   CSS Modules, PostCSS
    *   Lucide React (for icons)
    *   Keen Slider (for testimonial carousel)
*   **Deployment:**
    *   [Vercel](https://vercel.com/) (Recommended)
    *   [Docker](https://www.docker.com/) (Dockerfile provided)

## Project Structure

The project follows the Next.js App Router structure:

```
├── app/
│   ├── (route)/                # Grouped routes
│   │   ├── Room/               # Video consultation room
│   │   ├── book-tc/            # Teleconsultation booking
│   │   ├── details/            # Doctor details and in-clinic booking
│   │   ├── prescriptions/      # Prescription viewing
│   │   └── search/             # Doctor search by category
│   ├── _components/            # Global components (Header, Hero, Testimonials)
│   ├── api/                    # API routes (e.g., sendEmail)
│   ├── fonts/                  # Local fonts (Geist)
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout
│   └── page.js                 # Homepage
├── components/
│   └── ui/                     # Shadcn UI components
├── emails/                     # Email templates (React Email)
├── lib/                        # Utility functions
├── public/                     # Static assets
├── .dockerignore
├── .gitignore
├── Dockerfile
├── middleware.js
├── next.config.mjs
├── package.json
├── tailwind.config.js
└── README.md                   # This file
```

## Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables. Obtain these values from your backend services and ZegoCloud/Resend dashboards.

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:YOUR_BACKEND_PORT # Or your deployed backend URL
NEXT_PUBLIC_ZEGOCLOUD_APP_ID=YOUR_ZEGOCLOUD_APP_ID
NEXT_PUBLIC_ZEGOCLOUD_SECRET=YOUR_ZEGOCLOUD_SERVER_SECRET
RESEND_API_KEY=YOUR_RESEND_API_KEY
```

**Note:**
*   `NEXT_PUBLIC_BACKEND_URL`: URL of your backend server application.
*   The ZegoCloud credentials are used directly on the client-side for token generation in this setup (specifically `generateKitTokenForTest`). For production, consider a more secure token generation strategy involving your backend.

## Getting Started

First, ensure you have Node.js (v18 or later recommended) and npm/yarn/pnpm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Healthily-User.git
    cd Healthily-User
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary variables as described in the "Environment Variables" section.

4.  **Run the development server:**
    The application is configured to run on port `3001` by default (see `package.json` script `dev: "next dev -p 3001"`).
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5.  Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Running with Docker

A `Dockerfile` is provided for building and running the application in a containerized environment.

1.  **Build the Docker image:**
    ```bash
    docker build -t healthily-user .
    ```

2.  **Run the Docker container:**
    Make sure to pass the necessary environment variables to the container.
    ```bash
    docker run -p 3001:3000 \
      -e NEXT_PUBLIC_BACKEND_URL=your_backend_url \
      -e NEXT_PUBLIC_ZEGOCLOUD_APP_ID=your_zegocloud_app_id \
      -e NEXT_PUBLIC_ZEGOCLOUD_SECRET=your_zegocloud_server_secret \
      -e RESEND_API_KEY=your_resend_api_key \
      healthily-user
    ```
    The application inside the Docker container will run on port `3000` (as specified by `EXPOSE 3000` and `CMD ["npm", "start"]` which typically runs Next.js on port 3000 by default). The command above maps port `3001` on your host to port `3000` in the container. Access it via `http://localhost:3001`.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. Remember to configure your environment variables in the Vercel project settings.

---

This README provides a comprehensive guide to understanding, setting up, and running the Healthily-User application.