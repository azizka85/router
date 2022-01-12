import { LocationMock } from "./location-mock";

export class HistoryMock {
  protected location: LocationMock;

  constructor(location: LocationMock);

  replaceState(state: any, data: any, path: string): void;

  pushState(state: any, data: any, path: string): void;

  changeLocation(path: string): void;
}
