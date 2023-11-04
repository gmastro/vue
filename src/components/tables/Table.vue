<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { hasOrEmpty, powerSet } from '@/functions/helpers';
import type { JSONObject, JSONValue } from '@/interfaces/json';

export default defineComponent({
    name: 'Table',
    props: {
        options: {
            type: Object,
            default: {}
        },
        content: {
            type: Object,
            default: {}
        },
    },
    setup(props, context) {
        const delimiter: string = props.options?.delimiter ?? '-';
        const tableClass: string = context.attrs.class === "string" ? context.attrs.class : "table";

        let container: {[_:string | symbol | number]: JSONValue} = {};

        const styles = (c:JSONObject | object, path: string[]) => {
            Object.entries(c).map(([k, v]) => {
                const pathToString = path.join(delimiter);

                if(v === null) {
                    return;
                }

                if(/^\d+$/.test(k) === true) {
                    if(/t[rdh]{1}$/.test(pathToString) === true && typeof v === "object") {
                        styles(v, [...path, k]);
                    }
                    return;
                }

                switch(k) {
                    case 'className':
                        container[pathToString] = v;
                        break;
                    case 'thead':
                    case 'tbody':
                    case 'tfoot':
                    case 'tr':
                    case 'td':
                    case 'th':
                        styles(v, [...path, k]);
                        break;
                    case 'caption':
                    default:
                        break;
                }
            });

            return container;
        };

        styles(props.options?.styles ?? {}, [tableClass]);

        return {
            tableClass: tableClass,
            css: container,
            delimiter: delimiter,
        };
    },
    computed: {
        renderCaption: function(): string {
            return hasOrEmpty('caption', this.$props.options, '');
        },
        showCaption: function(): boolean {
            return hasOrEmpty('caption', this.$props.options, '') !== '';
        },
        showHeader: function(): boolean {
            return hasOrEmpty('showHeader', this.$props.options, true);
        },
        showFooter: function(): boolean {
            const footer = hasOrEmpty('showFooter', this.$props.options, true);
            const content = hasOrEmpty('footer', this.$props.options, {});
            return footer && Object.keys(content).length > 0;
        },
        renderData: function(): any[] {
            return hasOrEmpty('data', this.$props.content, []);
        },
        renderHeader: function(): string[]
        {
            const fields = hasOrEmpty('fields', this.$props.content, []);
            const tableData = hasOrEmpty('data', this.$props.content, []);

            if(fields.length === 0) {
                if(tableData.length === 0) {
                    return [];
                }
                
                const [first, ...rest] = tableData;
                return Object.keys(first);
            }

            return fields;
        },
    },
    methods: {
        renderContent: (columnName: string, render: {[_:string]: string}): string | null => {
            return render?.[columnName];
        },
        setClass: (styles: JSONObject, el:string, tags: (number|string)[], combos: (number|string)[] = [], delimiter: string = '-'): JSONValue => {
            const wrapper: string = tags.join(delimiter);
            const wrapperExpression = new RegExp(`^${wrapper}`);
            const matches: object = Object.entries(styles).filter(([k,v]) => wrapperExpression.test(k)).map(v => {return {[v[0]]: v[1]}});

            if(Object.keys(matches).length === 0) {
                return null;
            }

            type WeightPath = {weight: number, css: JSONValue};
            let paths: WeightPath[] = [];
            const expression = new RegExp(`(-\\d+)?${el}(-\\d+)?$`);

            for(const path of powerSet(combos, 1)) {
                let css: JSONValue = styles?.[[...tags, ...path].join(delimiter)];
                if(typeof css === "string" && expression.test(css.toString())) {
                    paths.push({weight: expression.exec(css)?.filter(m => m != undefined).length ?? 0, css:css})
                }
            }

            if(paths.length > 0) {
                return paths.reduce((p: WeightPath | null, c: WeightPath, i) => p === null || p.weight < c.weight ? c : p ).css;
            }

            return styles?.[tags.join(delimiter)];
        }
    }
});
</script>

<template>
    <table :class="tableClass">
        <caption v-if="showCaption" :class="setClass(css, 'caption', [tableClass, 'caption'])" v-html="renderCaption"></caption>
        <thead v-if="showHeader" :class="setClass(css, 'thead', [tableClass, 'thead'])">
            <tr :class="setClass(css, 'tr', [tableClass, 'thead', 'tr'])">
                <th v-for="(col, ci) in content.header" :key="ci" :class="setClass(css, 'th', [tableClass, 'thead', 'tr', 'th'], [ci])">
                    {{ content.locale[col] }}
                </th>
            </tr>
        </thead>
        <tfoot v-if="showFooter" :class="setClass(css, 'tfoot', [tableClass, 'tfoot'])">
            <tr :class="setClass(css, 'tr', [tableClass, 'tfoot', 'tr'])">
                <!-- needs cols or at least a way to have equal number of td's with the rest of the table -->
                <td :class="setClass(css, 'td', [tableClass, 'tfoot', 'tr', 'td'])"></td>
            </tr>
        </tfoot>
        <tbody>
            <tr v-for="(row, ri, rk) in renderData" :key="[ri, rk].join('-')" :class="setClass(css, 'tr', [tableClass, 'tbody', 'tr'], [ri])">
                <td v-for="(col, ci) in content.header" :key="[ri, rk, col, ci].join('-')" :class="setClass(css, 'td', [tableClass, 'tbody', 'tr'], [ri, 'td', ci])">
                    <template v-if="renderContent(col, options.render) === 'image'">
                        <img :src="row[col]" :alt="row[col]" />
                    </template>
                    <template v-else>
                        {{ row[col] }}
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
</template>
