export function trimSlashes(path: string): string;

export function transformURL(url: string, currentPath: string, root: string): string;

export function parseQuery(query: string): {
  [key: string]: string
};

export function parseRouteRule(route: string | RegExp): RegExp;
