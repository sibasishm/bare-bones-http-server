import { HttpRequest } from '../http/parser';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export class StaticFileHandler {
  constructor(private rootDir: string) { }

  async handle(request: HttpRequest) {
    // Handle root path
    const path = request.path === '/' ? '/index.html' : request.path;
    const filePath = join(this.rootDir, path);

    if (!existsSync(filePath)) {
      return {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': '9'
        },
        body: 'Not Found'
      };
    }

    try {
      const content = await readFile(filePath);
      const contentType = this.getContentType(filePath);

      return {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': content.length.toString()
        },
        body: content.toString()
      };
    } catch (error) {
      console.error('Error serving static file:', error);
      return {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': '21'
        },
        body: 'Internal Server Error'
      };
    }
  }

  private getContentType(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon'
    };
    return contentTypes[ext || ''] || 'application/octet-stream';
  }
} 