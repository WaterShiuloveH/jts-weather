# JTS Weather App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The JTS Weather App fetches and displays real-time weather data from the Central Weather Bureau (CWA) API, including temperature and rain probability for various regions.

## Features

- Displays weather information including **maximum temperature**, **minimum temperature**, and **12-hour rain probability**.
- Fetches real-time weather data from the [CWA API](https://opendata.cwa.gov.tw/api).
- Select different regions to view their weather data.
- Responsive UI built with **React.js**, **TailwindCSS**, and **Next.js**.

## Getting Started

To run the development server, follow these steps:

### 1. Install dependencies

Make sure you have **Node.js** installed. If you don't have it, you can download it from [here](https://nodejs.org/).

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set up environment variables

In the project root, create a .env.local file and add your CWA API key like this:

```bash
NEXT_PUBLIC_WEATHER_API_KEY=your-api-key-here
```

### 3. Run the development server

Once you've installed the dependencies and set up the environment variables, you can start the development server using one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

This will start the server, and you can open your browser and navigate to http://localhost:3000 to see the app in action.

The page will auto-update as you edit the project files. You can start editing the page by modifying app/page.tsx.
