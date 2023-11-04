import type { Component } from "vue";
import { useRoute, type LocationQuery } from "vue-router";

export interface User {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar?: string;
    created_at?: Date;
    updated_at?: Date;
    groups: string[];
    roles: string[];
};

export interface Route {
    isBrand?: boolean;
    hasChildren?: boolean;
    href: string;
    text: string | Component;
    name: string;
    groups: string[];
    roles: string[];
    children?: Route[];
};

export const guestRoles: string[] = ['?', '*'];
export const guestGroups: string[] = guestRoles;
export const visitor: User = {
    groups: guestGroups,
    roles: guestRoles,
};

/**
 * Nested list flatten.
 *
 * It will check for unique value, will just push given datatype
 * @param storage 
 * @param param1 
 */
export const flatten = <T>(storage: T[], [v, ...vs]: any): T[] => {
    if(Array.isArray(v)) {
        storage = flatten(storage, v);
    } else if(v !== undefined) {
        storage.push(v);
    }

    return vs.length === 0 ? storage : flatten(storage, vs);
};

/**
 * Power Set
 *
 * Provides list of combinations in a n2logn complexity rather than n3.
 *
 * @param   data Array of anything to use and add
 * @param   minLength Length of the accepted combinations, or could be a dependency providing different set of accepted
 *          comparisons
 */
export const powerSet = <T>(data: T[], minLength: number = 1) : T[][] => {
    const l: number = data.length;
    const p: number = Math.pow(2, l);
    let i: number,
        j: number,
        b: string,
        c: T[],
        o: T[][] = [];
    for(i = 0; i < p; i++) {
        b = (i >>> 0).toString(2).padStart(l, "0");
        c = [];
        for(j = 0; j < l; j++) {
            if(b[j] === "1") {
                c.push(data[j]);
            }
        }

        if (c.length >= minLength) {
            o.push(c);
        }
    }

    return o;
};

/**
 * Visitors or guests validation
 *
 * @param user 
 */
export const isGuest = (user: User): boolean => user === visitor;

/**
 * Concatenates user first and last names
 *
 * @param user 
 */
export const fullname = (user: User): string  => `${user.first_name} ${user.last_name}`;

/**
 * Check if an array contains the given value
 *
 * @param key 
 * @param a 
 */
export const has = <T>(key: T, a: T[]): boolean => a.indexOf(key) > -1;

/**
 * An intersection or union of keys found an array of the same data type
 *
 * @param keys 
 * @param a 
 * @param intersect 
 * @param invert 
 */
export const multiHas = <T>(keys: T[], a: T[], intersect: boolean = true, invert: boolean = false): boolean => {
    let intersection: boolean = true;
    let union: boolean = false;
    let found: boolean = true;
    for(let key of keys) {
        found = has<T>(key, a);
        intersection = intersection && found;
        union = union || found;
    }

    const flag: boolean = intersect ? intersection : union;
    return invert ? !flag : flag;
}

/**
 * Access
 *
 * Allow route display depending upon access permissions.
 *
 * > **Note**: this is an hybrid for granting access or permissions and should not be used as is.
 *
 * @param   route Route to examine
 * @param   user User with certain roles and within certain groups
 */
export const hasAccess = (route: Route, user: User): boolean => 
    multiHas<string>(user.groups, route.groups, false)
    && multiHas<string>(user.roles, route.roles, false);

/**
 * Return Property
 *
 * From an obhect it will check whether the given property exists. If not it will return a default value through
 * emptyType argument.
 *
 * @param   property Key of the property.
 * @param   o Object containing required value
 * @param   emptyType Default value to return
 */
export const hasOrEmpty = <T>(property: string | symbol | number, o: {[_:string | symbol | number]: T}, emptyType: T): T => 
    o.hasOwnProperty(property) ? o[property] : emptyType;

/**
 * Submenu Toggle
 *
 * Unlike the dropdown event, this one generates initial state per component.
 * > **Note**:  This function will cause side effects on the provided menu structure
 *
 * @param   routeName Unique identifier name per route.
 * @param   menu Menu object holding active/inactive dropdown components
 */
export const toggleSubmenu = (routeName: string, menu: {[key: string]: boolean}): boolean => 
    menu.hasOwnProperty(routeName) ? menu[routeName] : false;

/**
 * Sets ini
 *
 * @param param0 Destructured routes
 * @param menu Storage for all those menus to display
 */
export const recursiveInitSubmenu = ([r, ...rx]: Route[], menu: {[key: string]: boolean} = {}): {[key: string]: boolean} => {
    if (r.hasOwnProperty('children') === false || typeof r.children === 'undefined') {
        return recursiveInitSubmenu(rx, menu);
    }

    if (r.children.length === 0) {
        menu = recursiveInitSubmenu(rx, menu);
    } else {
        menu[r.name] = toggleSubmenu(r.name, menu);
    }

    return rx.length === 0 ? menu : recursiveInitSubmenu(rx, menu);
}

/**
 * Recursive Access
 *
 * It will return all those routes which, the given user has access.
 * Use it with computed to cache the result for a given set of user groups/roles
 *
 * @param   routes Routes to examine
 * @param   user User with certain roles and within certain groups
 * @returns Route[]
 */
export const recursiveHasAccess = (routes: Route[] = [], user: User): Route[] => {
    let list = routes.map( (r: Route) => {
        r.children = recursiveHasAccess(r.children, user)
        r.isBrand = r.hasOwnProperty('isBrand') && r.isBrand === true;
        r.hasChildren = r.children.length > 0;

        return r;
    });

    return list.filter( (r: Route) => hasAccess(r, user));
}

/**
 * Dropdown toggle
 *
 * > **Note**:  This function will cause side effects on the provided menu structure
 *
 * @param   routeName Unique identifier name per route
 * @param   menu Menu object holding active/inactive dropdown components
 */
export const toggleDropdown = (routeName: string, menu: {[key: string]: boolean}): void => {
    menu[routeName] = menu.hasOwnProperty(routeName) ? !menu[routeName] : true;
};

/**
 * Capitalize Word
 *
 * @param   string word
 * @return  string
 */
export const capitalize = (word: string): string => {
    const l: number = word.length;

    switch(l) {
        case 0:  return word;
        case 1:  return word.toLocaleUpperCase();
        default: return word[0].toLocaleUpperCase() + word.substring(1).toLocaleLowerCase();
    }
};

/**
 * Uri Generator
 *
 * Generates a url with given query parameters.
 * It will either add or replace query parameters into the given path and will if requested nicefy the url
 *
 * @param   path Original path to concatenate query parameters
 * @param   params Added or replaced parameters
 * @param   nicefy Either default uri format or nicefied with given delimiter
 * @param   delimiter Defaults to backslash
 * @return  string
 */
export const uriGenerator = (path: string, params: object | LocationQuery = {}, nicefy: boolean = false, delimiter: string = '/'): string => {
    if (Object.keys(params).length === 0) {
        return path;
    }

    const query = {...useRoute().query, ...params};

    if (nicefy === true) {
        return [path, ...Object.keys(query).map((k:string) => `${k}${delimiter}${query[k]}`)].join(delimiter);
    }

    return [path, Object.keys(query).map((k:string) => `${k}=${query[k]}`).join('&')].join('?');
};
