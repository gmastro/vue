import type { Component } from "vue";

export type JSONValue = 
 | string
 | number
 | boolean
 | null
 | JSONValue[]
 | {[key: string]: JSONValue}

export interface JSONObject {
  [k: string]: JSONValue
}

export interface JSONArray extends Array<JSONValue> {}

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

/**
 * Nested list flatten.
 *
 * It will check for unique value, will just push given datatype
 * @param storage 
 * @param param1 
 */
export function flatten <T>(storage: T[], [v, ...vs]: any): T[] {
    if(Array.isArray(v)) {
        storage = flatten(storage, v);
    } else if(v !== undefined) {
        storage.push(v);
    }

    return vs.length === 0 ? storage : flatten(storage, vs);
};

export const guestRoles: string[] = ['?', '*'];
export const guestGroups: string[] = guestRoles;
export const visitor: User = {
    groups: guestGroups,
    roles: guestRoles,
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
// or
// return [user.first_name, user.last_name].join(' ');

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

    let flag: boolean = intersect ? intersection : union;
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
        case 1:  return word[0].toLocaleUpperCase();
        default: return word[0].toLocaleUpperCase() + word.substring(1).toLocaleLowerCase();
    }
}