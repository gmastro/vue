<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { hasOrEmpty } from '@/functions/helpers';

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
        return {
            hasOrEmpty,
        };
    },
    computed: {
        tableClass: function(): string {
            return hasOrEmpty('tableClass', this.$props.options, 'table');
        },
        captionClass: function(): string {
            return hasOrEmpty('captionClass', this.$props.options, 'table-caption');
        },
        tHeadClass: function(): string {
            return hasOrEmpty('theadClass', this.$props.options, 'table-thead');
        },
        tBodyClass: function(): string {
            return hasOrEmpty('tbodyClass', this.$props.options, 'table-tbody');
        },
        tFootClass: function(): string {
            return hasOrEmpty('tfootClass', this.$props.options, 'table-tfoot');
        },
        trClass: function(): string {
            return hasOrEmpty('trClass', this.$props.options, 'table-tr');
        },
        thClass: function(): string {
            return hasOrEmpty('thClass', this.$props.options, 'table-th');
        },
        tdClass: function(): string {
            return hasOrEmpty('tdClass', this.$props.options, 'table-td');
        },
        renderCaption: function(): string {
            return hasOrEmpty('caption', this.$props.content, '');
        },
        showCaption: function(): boolean {
            return hasOrEmpty('caption', this.$props.options, true) && hasOrEmpty('caption', this.$props.content, '') !== '';
        },
        showHeader: function(): boolean {
            return hasOrEmpty('showHeader', this.$props.options, true);
        },
        showFooter: function(): boolean {
            const footer = hasOrEmpty('showFooter', this.$props.options, true);
            const content = hasOrEmpty('footer', this.$props.content, {});
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
        }
    }
});
</script>

<template>
    <table :class="tableClass">
        <caption v-if="showCaption" :class="captionClass" v-html="renderCaption"></caption>
        <thead v-if="showHeader" :class="tHeadClass">
            <tr>
                <th v-for="(col, index) in content.header" :key="index">
                    {{ content.locale[col] }}
                </th>
            </tr>
        </thead>
        <tfoot v-if="showFooter" :class="tFootClass">
            <tr :class="trClass">
                <td :class="tdClass"></td>
            </tr>
        </tfoot>
        <tbody>
            <tr v-for="(row, rk, ri) in renderData" :key="[ri, rk].join('-')" :class="trClass">
                <td v-for="(col, ci) in content.header" :key="[ri, rk, col, ci].join('-')">
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
