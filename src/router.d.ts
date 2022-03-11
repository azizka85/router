import { Page } from './data/page';
import { Route } from './data/route';
import { RouterOptions } from './data/router-options';

export class Router<RouteOptions = any, RouteState = any> {
  protected routes: Route<RouteOptions, RouteState>[];
  protected root: string;
  protected before?(page: Page<RouteOptions, RouteState>): boolean;
  protected page404?(page: Page<RouteOptions, RouteState>): void;

  constructor(options?: RouterOptions<RouteOptions, RouteState>);

  get rootPath(): string;

  addRoutes(routes: Route<RouteOptions, RouteState>[]): void;

  add(
    rule: string | RegExp, 
    handler?: (page: Page<RouteOptions, RouteState>) => void, 
    options?: RouteOptions
  ): Router;

  remove(
    param: string | RegExp | ((page: Page<RouteOptions, RouteState>) => void)
  ): Router;

  findRoute(currentPath: string): {
    match: RegExpMatchArray,
    route: Route<RouteOptions, RouteState>
  } | undefined;

  processUrl(
    currentPath: string, 
    currentQuery: { [key: string]: string }, 
    state?: RouteState
  ): void;  
}
