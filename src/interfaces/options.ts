import type { RouteLocationRaw } from "vue-router";

export interface Options {
    [_:string | symbol]  : any
};

export interface UriQueryOptions extends Options {
    page                : string | String | "page",
    items               : string | String | "items",
};

export interface PaginateOptions extends Options {
    data    : any[],
};

export interface PagerOptions extends Options {
    url                 : string | String | "" | "/",
    items               : bigint | BigInt,
    direction           : "both" | "before" | "after",
    show                : {
        firstLast           : boolean | Boolean,
        previousNext        : boolean | Boolean,
    },
    buttons             : {
        [_:string | symbol] : string | number | bigint | String | Number | BigInt,
        first               : string | String | "<<" | "&lt;&lt;",
        previous            : string | String | "<" | "&lt;",
        next                : string | String | ">" | "&gt;",
        last                : string | String | ">>" | "&gt;&gt;",
        page                : string | number | bigint | String | Number | BigInt | "...",
    }
}

export interface PaginationOptions extends PaginateOptions, PagerOptions {
    query   : UriQueryOptions,
};

export type PagerNodes = {
    text    : string | String,
    link    : RouteLocationRaw,
    active  : boolean | Boolean,
};

export type PaginateRanges = {
    items   : bigint | BigInt,
    from    : bigint | BigInt,
    to      : bigint | BigInt,
    total   : bigint | BigInt,
};
