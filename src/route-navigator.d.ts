import { Router } from './router';

export class RouteNavigator<RouteOptions = any, RouteState = any> {
  protected router: Router<RouteOptions, RouteState>;

  protected popStateHandler: () => void;

  constructor(
    router: Router<RouteOptions, RouteState>
  );

  get fragment(): string;
  get query(): {[key: string]: string};

  redirectTo(url: string, state?: RouteState): Promise<void>;
  navigateTo(url: string, state?: RouteState): Promise<void>;
  refresh(): Promise<void>;

  addUriListener(): void;
  removeUriListener(): void;
}
