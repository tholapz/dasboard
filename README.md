# Hotel Manager Dashboard

A modern, professional dashboard application for hotel managers with powerful features to help manage hotel operations efficiently.

## Features

- **Hotel Inventory Management**: Track and manage all rooms in your hotel
- **Room Pricing Chart**: Visualize and adjust room pricing based on demand and seasonality
- **Room Status Tracking**: Monitor room statuses (available, occupied, maintenance, cleaning, reserved)
- **Daily Revenue Reporting**: View detailed revenue reports with visualizations
- **AI-driven Forecasting**: Get intelligent forecasts for demand, staffing, and maintenance

## Technology Stack

- React 18 with TypeScript
- Material UI for modern UI components
- Charts and data visualization with MUI X Charts
- Containerized with Docker

## Project Structure

```
frontend/
├── public/               # Static files
├── src/
│   ├── components/       # React components
│   │   ├── features/     # Feature-specific components
│   │   └── layout/       # Layout components
│   ├── data/             # Mock data (replace with API calls)
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main App component
│   ├── theme.ts          # MUI theme configuration
│   └── index.tsx         # Application entry point
├── Dockerfile            # Docker configuration
└── package.json          # Dependencies and scripts
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/hotel-dashboard.git
cd hotel-dashboard
```

2. Install dependencies:

```bash
cd frontend
npm install
# or
yarn
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. The application will be available at `http://localhost:3000`

### Docker Setup

1. Build the Docker image:

```bash
docker build -t hotel-dashboard ./frontend
```

2. Run the container:

```bash
docker run -p 3000:80 hotel-dashboard
```

3. Access the application at `http://localhost:3000`

### Using Docker Compose

You can also use Docker Compose to run the application:

```bash
docker-compose up
```

## Testing

Run the test suite with:

```bash
cd frontend
npm test
# or
yarn test
```

## Future Enhancements

- Backend API integration
- User authentication and role-based access control
- Real-time notifications for check-ins/check-outs
- Mobile application for on-the-go management
- Integration with booking platforms

## License

MIT
