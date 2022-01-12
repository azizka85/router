import { Page } from './page';

export interface Route<RouteOptions = any, RouteState = any> {
  rule: string | RegExp;
  handler?(page: Page<RouteOptions, RouteState>): Promise<void>;
  options?: RouteOptions;
}
