export interface Page {
  fragment: string;
  query: {[key: string]: any};
  match: RegExpMatchArray;
  options: any;
}

export interface Route {
  rule: string;
  handler?(page: Page): void;
  options: any;
}

export interface RouterOptions {
  root: string,
  routes: Route[],
  before?(page: Page): boolean;
  page404?(fragment: string): void;
}

export class Router {
  protected routes: Route[];
  protected root: string;
  protected before?(page: Page): boolean;
  protected page404?(fragment: string): void;

  constructor(options?: RouterOptions);

  get fragment(): string;
  get query(): {[key: string]: any};

  add(
    rule: string, 
    handler?: (page: Page) => void, 
    options?: any
  ): Router;

  remove(param: string | ((page: Page) => void)): Router;

  redirectTo(path: string, state?: any): Router;
  navigateTo(path: string, state?: any): Router;
  refresh(): Router;

  trimSlashes(path: string): string;
  parseRouteRule(route: string): RegExp;
  parseQuery(query: string): {[key: string]: any}
  findRoute(): boolean;
  processUri(): void;

  addUriListener(): void;
  removeUriListener(): void;
}