export interface HttpRequest {
  method: string;
  path: string;
  version: string;
  headers: Record<string, string>;
  body?: string;
}

export class HttpParser {
  private static parseRequestLine(line: string): { method: string; path: string; version: string } {
    const [method, path, version] = line.split(' ');
    return { method, path, version };
  }

  private static parseHeaders(headerLines: string[]): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const line of headerLines) {
      const [key, value] = line.split(': ').map(s => s.trim());
      if (key && value) {
        headers[key.toLowerCase()] = value;
      }
    }
    return headers;
  }

  static parse(rawRequest: string): HttpRequest {
    const [requestLine, ...rest] = rawRequest.split('\r\n');
    const { method, path, version } = this.parseRequestLine(requestLine);

    const emptyLineIndex = rest.findIndex(line => line === '');
    const headerLines = rest.slice(0, emptyLineIndex);
    const body = rest.slice(emptyLineIndex + 1).join('\r\n');

    return {
      method,
      path,
      version,
      headers: this.parseHeaders(headerLines),
      body: body || undefined
    };
  }
} 