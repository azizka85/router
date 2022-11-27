export interface Page<RouteOptions = any, RouteState = any> {
    fragment: string;
    query: {
        [key: string]: any;
    };
    match?: RegExpMatchArray;
    options?: RouteOptions;
    state?: RouteState;
}
