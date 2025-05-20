import { HttpRequest } from './http/parser';

type RouteHandler = (req: HttpRequest) => Promise<{
  status: number;
  headers: Record<string, string>;
  body: string;
}>;

export class Router {
  private routes: Map<string, Map<string, RouteHandler>> = new Map();

  public get(path: string, handler: RouteHandler) {
    this.addRoute('GET', path, handler);
  }

  public post(path: string, handler: RouteHandler) {
    this.addRoute('POST', path, handler);
  }

  private addRoute(method: string, path: string, handler: RouteHandler) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }
    this.routes.get(method)!.set(path, handler);
  }

  public getHandler(method: string, path: string): RouteHandler | undefined {
    return this.routes.get(method)?.get(path);
  }
} 