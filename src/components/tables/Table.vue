<script lang="ts">
import { defineComponent } from 'vue';
import PagesNav from '@/components/tables/PagesNav.vue';
import { Paginate } from '@/classes/Paginator';

export default defineComponent({
    name: 'Table',
    components: {
        PagesNav,
    },
    props: {
        options: {
            type: Object,
            default: {}
        },
        content: {
            type: Object,
            default: {}
        },
        url: {
            type: String,
            required: true,
        }
    },
    setup(props, context) {
        const hasOrEmpty = <T>(property: string, o: {[_:string]: T}, emptyType: T): T => 
            o.hasOwnProperty(property) ? o[property] : emptyType;

        return {
            hasOrEmpty,
        };
    },
    computed: {
        tableClass: function(): string {
            return this.hasOrEmpty('tableClass', this.$props.options, 'table');
        },
        captionClass: function(): string {
            return this.hasOrEmpty('captionClass', this.$props.options, 'table-caption');
        },
        tHeadClass: function(): string {
            return this.hasOrEmpty('theadClass', this.$props.options, 'table-thead');
        },
        tBodyClass: function(): string {
            return this.hasOrEmpty('tbodyClass', this.$props.options, 'table-tbody');
        },
        tFootClass: function(): string {
            return this.hasOrEmpty('tfootClass', this.$props.options, 'table-tfoot');
        },
        trClass: function(): string {
            return this.hasOrEmpty('trClass', this.$props.options, 'table-tr');
        },
        thClass: function(): string {
            return this.hasOrEmpty('thClass', this.$props.options, 'table-th');
        },
        tdClass: function(): string {
            return this.hasOrEmpty('tdClass', this.$props.options, 'table-td');
        },
        renderCaption: function(): string {
            return this.hasOrEmpty('caption', this.$props.content, '');
        },
        showCaption: function(): boolean {
            return this.hasOrEmpty('caption', this.$props.options, true) && this.hasOrEmpty('caption', this.$props.content, '') !== '';
        },
        showHeader: function(): boolean {
            return this.hasOrEmpty('showHeader', this.$props.options, true);
        },
        showFooter: function(): boolean {
            const footer = this.hasOrEmpty('showFooter', this.$props.options, true);
            const content = this.hasOrEmpty('footer', this.$props.content, {});
            return footer && Object.keys(content).length > 0;
        },
        renderData: function(): Paginate {
            return new Paginate(this.hasOrEmpty('data', this.$props.content, []));
        },
        renderHeader: function(): string[]
        {
            const fields = this.hasOrEmpty('fields', this.$props.content, []);
            const tableData = this.hasOrEmpty('data', this.$props.content, []);

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
    <div>
        <PagesNav :pages="renderData" :url="$props.url"/>
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
                <tr v-for="(row, rk, ri) in renderData.getContent()" :key="[ri, rk].join('-')" :class="trClass">
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
        <PagesNav :pages="renderData" :url="$props.url"/>
    </div>
</template>
