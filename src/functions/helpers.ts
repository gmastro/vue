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
    href: string;
    text: string;
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
    } else {
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
export function isGuest(user: User): boolean {
    return user === visitor;
};

/**
 * Concatenates user first and last names
 *
 * @param user 
 */
export function fullname(user: User): string {
    return `${user.first_name} ${user.last_name}`;
    // or
    // return [user.first_name, user.last_name].join(' ');
}

/**
 * Check if an array contains the given value
 *
 * @param key 
 * @param a 
 */
export function has<T>(key: T, a: T[]): boolean {
    return a.indexOf(key) > -1;
}

/**
 * An intersection or union of keys found an array of the same data type
 *
 * @param keys 
 * @param a 
 * @param intersect 
 * @param invert 
 */
export function multiHas<T>(keys: T[], a: T[], intersect: boolean = true, invert: boolean = false): boolean {
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
 * @param route 
 * @param user 
 */
export function hasAccess(route: Route, user: User): boolean {
    return multiHas<string>(user.groups, route.groups, false)
        && multiHas<string>(user.roles, route.roles, false);
}
