<script lang="ts">
import { defineComponent } from 'vue';
import { type User, flatten } from '@/functions/helpers';
import type { JSONObject, JSONValue } from '@/interfaces/json';
import { Pagination } from '@/classes/Pagination';
import { pagerDefaultOptions } from '@/classes/Pager';
import Table from '@/components/tables/Table.vue';
import PagesNav from '@/components/tables/PagesNav.vue';
import UsersData from '@/data/nestedlist.json';
import { locales } from '@/data/locales';
import { useRoute } from 'vue-router';

// import '../library/strings.ts';
// console.log("test {0}".formatUnicorn("whatever"));

export default defineComponent({
    name: 'Users',
    props: {
        language: {
            type: String,
            default: "en",
        },
        locale: {
            type: String,
            default: "en-US",
        },
    },
    components: {
        Table,
        PagesNav,
    },
    setup(props, context) {
        const languages: JSONObject = locales[props.language];
        const locale: JSONValue = languages[props.locale];
        const options: JSONObject = {
            locale: locale,
            caption: 'Loaded from file user data',
            header: ['avatar', 'id', 'first_name', 'last_name', 'email'/*, 'created_at', 'updated_at'*/],
            render: {avatar: {img: {width:200, height: 200}}},
            delimiter: '-',
            styles: {
                className: 'table',
                caption: null,
                thead: {
                    className: 'thead',
                    tr: {
                        className: 'thead-tr',
                        th: {
                            2: {
                                className: 'thead-tr-th'
                            },
                        },
                    }
                },
                tbody: {
                    className: 'tbody',
                    tr: {
                        className: 'tbody-tr',
                        td: {
                            className: 'tbody-tr-td',
                            3: {
                                className: 'tbody-tr-td-3',
                                },
                            },
                        0 : {
                            className: 'tbody-tr-0',
                            td: {
                                className: 'tbody-tr-0-td',
                                0: {
                                    className: 'tbody-tr-0-td-0'
                                },
                            },
                        }
                    },
                },
                tfoot: {
                    className: 'tfoot',
                },
            },
            showCaption: true,
            showHeader: true,
            showFooter: false,
        };

        return {
            options: options,
            paginationData: flatten<User>([], UsersData.data),
        };
    },
    computed: {
        pagination: function() {
            const pagination: Pagination = new Pagination({
                ...pagerDefaultOptions,
                data: this.paginationData,
                url: "/users",
                query: {page: "page[users]", items: "items[users]"}
            });

            pagination.run(useRoute().query);

            return {
                ...this.options,
                data    : pagination.paginate().getContent(),
                ranges  : pagination.paginate().ranges(),
                pager   : pagination.pager().getContent(),
            };
        },
    }
});
</script>

<template>
    <div>
        <PagesNav :ranges="pagination.ranges" :content="pagination.pager"/>
        <Table :options="options" :content="pagination" />
    </div>
</template>
