export type JSONValue = 
 | string
 | number
 | boolean
 | null
 | JSONValue[]
 | {[_: string | number | symbol]: JSONValue}

export interface JSONObject {
    [_: string | number | symbol]: JSONValue
}

export interface JSONArray extends Array<JSONValue | JSONObject> {}
