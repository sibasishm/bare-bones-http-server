# Bare Bones HTTP Server

A minimal HTTP server built from scratch in TypeScript. This project
demonstrates the fundamentals of HTTP protocol, TCP sockets, and web server
implementation.

## Features

- Raw TCP socket handling
- HTTP/1.1 protocol parsing
- Static file serving
- API route handling
- Support for GET and POST methods
- Content-Type detection
- Error handling

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Usage

The server runs on port 3000 by default. Try these endpoints:

- `GET /` - Serves the static index.html
- `GET /api/hello` - Returns a hello message
- `POST /api/echo` - Echoes back your request body

## Project Structure

- `src/http/parser.ts` - HTTP protocol parser
- `src/server.ts` - Core server implementation
- `src/router.ts` - API route handling
- `src/handlers/static.ts` - Static file serving
- `public/` - Static files directory

## Learning Points

1. HTTP Protocol Basics
2. TCP Socket Programming
3. Request/Response Cycle
4. Header Parsing
5. Content Type Handling
6. Route Management
7. Static File Serving
8. Error Handling
