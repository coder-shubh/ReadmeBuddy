# Deploying to Firebase Hosting

This Next.js application is configured for deployment to Firebase App Hosting.

## Prerequisites

1.  **Firebase Project**: Make sure you have created a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Firebase CLI**: Install the Firebase Command Line Interface globally if you haven't already.
    ```bash
    npm install -g firebase-tools
    ```

## Deployment Steps

1.  **Login to Firebase**:
    ```bash
    firebase login
    ```

2.  **Initialize Firebase**: Run the `init` command in your project's root directory.
    ```bash
    firebase init
    ```
    - When prompted, choose **App Hosting**.
    - Follow the on-screen instructions to select your Firebase project and configure the backend.

3.  **Deploy**: After initialization, deploy your application with a single command.
    ```bash
    firebase deploy
    ```

Firebase will build and deploy your application. Once finished, it will provide you with the URL to your live site.
