import type { JSONObject } from '@/interfaces/json';

export type Locales = {
    [_:string]: JSONObject,
};

export const locales: Locales = {
    "en" : {
        "en-US": {
            "avatar": "Avatar",
            "id" : "ID",
            "first_name" : "First",
            "last_name" : "Last",
            "email": "Email",
            "created_at": "Created At",
            "updated_at": "Updated At",
            "components-tables-pager-summary": "Displaying {items} results per page. Range {from} - {to} out of {total}",
            "users-table-caption": "Loaded from file user data",
        }
    }
};
