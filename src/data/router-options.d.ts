import { Page } from './page';
import { Route } from './route';

export interface RouterOptions<RouteOptions = any, RouteState = any> {
    root?: string;
    routes?: Route<RouteOptions, RouteState>[];
    before?(page: Page<RouteOptions, RouteState>): Promise<boolean>;
    page404?(page: Page<RouteOptions, RouteState>): Promise<void>;
}
