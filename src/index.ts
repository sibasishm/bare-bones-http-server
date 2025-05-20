import { HttpServer } from './server';
import { HttpRequest } from './http/parser';

const server = new HttpServer(3000);

// Example API route
server.get('/api/hello', async (req: HttpRequest) => {
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': '25'
    },
    body: JSON.stringify({ message: 'Hello, World!' })
  };
});

// Example POST route
server.post('/api/echo', async (req: HttpRequest) => {
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': req.body?.length.toString() || '0'
    },
    body: req.body || ''
  };
});

server.listen(); 