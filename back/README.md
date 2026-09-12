# Smart Commerce System API

A professional backend platform for managing commerce data with statistical endpoints.

## Features

- RESTful API architecture
- JWT Authentication
- Role-based access control
- Request validation
- Error handling
- Caching for statistical endpoints
- Rate limiting
- Logging
- MongoDB integration
- API documentation

## Prerequisites

- Node.js >= 14.0.0
- MongoDB >= 4.4
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-commerce-system/api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration.

## Development

Start the development server:
```bash
npm run dev
```

## Production

Build and start the production server:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

## API Documentation

The API documentation is available at `/api-docs` when running the server.

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── app.js          # Application entry point
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Security

- JWT authentication
- Role-based access control
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation
- Error handling

## Caching

Statistical endpoints are cached for better performance. Cache duration can be configured in the `.env` file.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
