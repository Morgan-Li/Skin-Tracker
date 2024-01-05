# Fortnite Item Shop Tracker

Live Demo: [https://itemshoptracker.netlify.app/](https://itemshoptracker.netlify.app/)

## Introduction

Fortnite Item Shop Tracker is a web application designed to help Fortnite players track when their favorite items, like skins, were last seen in the shop and receive email alerts when those items appear in the shop. The tracker provides a daily update on the item's availability and notifies subscribed users via email.

## Technologies

- **Frontend:** React
- **Backend:** Node.js with Netlify Functions
- **Database:** MongoDB Atlas
- **Deployment:** Netlify
- **Email Notifications:** NodeMailer with Gmail
- **API:** Fortnite-API
- **Task Scheduler :** EasyCron

## Scheduled API Requests with EasyCron

This application requires daily checks of the Fortnite item shop to track item availability. While Netlify's serverless functions are good for handling backend tasks, they lack built-in scheduling capabilities (atleast for free). And so to automate this process, I utilized EasyCron, an online (free) cron job service, to schedule and trigger API requests to the Netlify serverless functions at 7:05PM EST time every day.

## Running Locally

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js and npm
- Netlify CLI (`npm install netlify-cli -g`)
- Git (for cloning the repository)

### Database Setup with MongoDB Atlas

This application uses MongoDB Atlas as a cloud database service to store and manage data, specifically for tracking item availability and managing the subscription list. Before running the application locally or deploying it, you need to set up a MongoDB Atlas cluster and obtain a connection string.

### Setting Up MongoDB Atlas

1. **Create a MongoDB Atlas Account:**
   - Sign up or log in to MongoDB Atlas on [MongoDB's website](https://www.mongodb.com/cloud/atlas).
   
2. **Create a Cluster:**
   - Once logged in, create a new cluster. The free tier should suffice for initial development and small applications.
   
3. **Configure Security Settings:**
   - Set up a database user with read and write privileges.
   - Configure the network access to allow connections from your application's IP address or enable access from anywhere (not recommended for production).

4. **Get Your Connection String:**
   - Once your cluster is set up, navigate to the "Connect" option for your cluster.
   - Choose "Connect your application."
   - Copy the provided connection string, and add to dot env file (specified later on).

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Morgan-Li/Skin-Tracker.git
   cd Skin-Tracker
   ```

2. **Frontend Setup:**
   - Navigate to the frontend directory: `cd frontend`
   - Install dependencies: `npm install`
   - Create a `.env` file in the `frontend` directory with the following content:
     ```
     REACT_APP_SKIN_TO_TRACK=Chun-Li
     ```

3. **Backend Setup:**
   - Navigate to the backend directory: `cd ../backend`
   - Install dependencies: `npm install`
   - Create a `.env` file in the `backend` directory with the following content:
     ```
     EMAIL_USERNAME=your-email@gmail.com
     EMAIL_PASSWORD=your-email-password
     MONGODB_ATLAS_CONNECTION=your-mongodb-connection-string
     SKIN_TO_TRACK=Chun-Li
     ```

### Setting Up EasyCron

1. **Create an EasyCron Account:**
   - Sign up or log in to [EasyCron](https://www.easycron.com/).

2. **Create a Cron Job:**
   - Once logged in, create a new cron job. You will need to specify the URL that EasyCron should hit and the schedule.
   
3. **Configure Schedule:**
   - Set the cron job to send a request at 7 PM EST every day. This aligns with the time Fortnite typically updates its item shop.
   - The expression for this schedule in cron format would be `0 19 * * *` if you're targeting 7 PM EST (I like to add a small buffer of 5 minutes just incase the API needs time to update), considering any timezone adjustments.

4. **Target Netlify Function:**
   - The URL for the cron job should be the endpoint for the Netlify function responsible for checking the item shop. It would typically look something like this: `https://your-netlify-domain.netlify.app/.netlify/functions/checkShop`

### Running the Application

1. **Start the Application:**
   - Ensure you are in the root of the `Skin-Tracker` directory.
   - Run `netlify dev` to start the backend 
   - Run `npm start` to start the frontend 
   - The application should open in your default browser, or you can navigate to the local address provided in the terminal.

### Using the Application

- Visit the homepage to see the timer indicating the last seen date of the tracked item.
- Use the subscription form to subscribe or unsubscribe from email alerts.

## Deployment

The application is deployed on Netlify with continuous deployment from the `main` branch of the GitHub repository. Any push or merge into the `main` branch triggers a new build and deployment.
