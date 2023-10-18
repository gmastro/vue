export type JSONValue = 
 | string
 | number
 | boolean
 | null
 | JSONValue[]
 | {[key: string]: JSONValue}

export interface JSONObject {
  [k: string | number | symbol]: JSONValue
}

export interface JSONArray extends Array<JSONValue> {}
