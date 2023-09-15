import { type JSONObject } from '@/functions/helpers';

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
            "updated_at": "Updated At"
        }
    }
}