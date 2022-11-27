export class HistoryMock {
    /**
     * @param {import('./location-mock').LocationMock} location
     */
    constructor(location: import('./location-mock').LocationMock);
    /**
     * @type {import('./location-mock').LocationMock}
     * @protected
     */
    protected location: import('./location-mock').LocationMock;
    /**
     * @param {any} state
     * @param {any} data
     * @param {string} path
     */
    replaceState(state: any, data: any, path: string): void;
    /**
     * @param {any} state
     * @param {any} data
     * @param {string} path
     */
    pushState(state: any, data: any, path: string): void;
    /**
     * @param {string} path
     */
    changeLocation(path: string): void;
}
