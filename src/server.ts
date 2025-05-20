import { createServer, Socket } from 'net';
import { HttpParser, HttpRequest } from './http/parser';
import { Router } from './router';
import { StaticFileHandler } from './handlers/static';

export class HttpServer {
  private server = createServer();
  private router: Router;
  private staticHandler: StaticFileHandler;

  constructor(private port: number = 3000) {
    this.router = new Router();
    this.staticHandler = new StaticFileHandler('public');
    this.setupServer();
  }

  private setupServer() {
    this.server.on('connection', this.handleConnection.bind(this));
  }

  private async handleConnection(socket: Socket) {
    let data = '';

    socket.on('data', (chunk) => {
      data += chunk.toString();

      if (data.includes('\r\n\r\n')) {
        try {
          const request = HttpParser.parse(data);
          console.log(`[${new Date().toISOString()}] ${request.method} ${request.path}`);
          this.handleRequest(socket, request);
        } catch (error) {
          console.error('Error parsing request:', error);
          this.sendError(socket, 400, 'Bad Request');
        }
        data = '';
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  private async handleRequest(socket: Socket, request: HttpRequest) {
    try {
      // Try API routes first
      const handler = this.router.getHandler(request.method, request.path);
      if (handler) {
        console.log(`Handling API route: ${request.method} ${request.path}`);
        const response = await handler(request);
        this.sendResponse(socket, response);
        return;
      }

      // Fall back to static file serving
      console.log(`Serving static file: ${request.path}`);
      const staticResponse = await this.staticHandler.handle(request);
      this.sendResponse(socket, staticResponse);
    } catch (error) {
      console.error('Error handling request:', error);
      this.sendError(socket, 500, 'Internal Server Error');
    }
  }

  private sendResponse(socket: Socket, response: { status: number; headers: Record<string, string>; body: string }) {
    const { status, headers, body } = response;
    const statusText = this.getStatusText(status);

    const responseLines = [
      `HTTP/1.1 ${status} ${statusText}`,
      ...Object.entries(headers).map(([key, value]) => `${key}: ${value}`),
      '',
      body
    ];

    socket.write(responseLines.join('\r\n'));
    socket.end();
  }

  private sendError(socket: Socket, status: number, message: string) {
    this.sendResponse(socket, {
      status,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': message.length.toString()
      },
      body: message
    });
  }

  private getStatusText(status: number): string {
    const statusMap: Record<number, string> = {
      200: 'OK',
      400: 'Bad Request',
      404: 'Not Found',
      500: 'Internal Server Error'
    };
    return statusMap[status] || 'Unknown';
  }

  public get(path: string, handler: (req: HttpRequest) => Promise<any>) {
    this.router.get(path, handler);
  }

  public post(path: string, handler: (req: HttpRequest) => Promise<any>) {
    this.router.post(path, handler);
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}/`);
    });
  }
} 