<script lang="ts">
import { defineComponent } from 'vue';
import { type User, flatten, type JSONObject, type JSONValue } from '@/functions/helpers';
import Table from '@/components/tables/Table.vue';
import UsersData from '@/data/nestedlist.json';
import { locales } from '@/data/locales';
import { useRoute } from 'vue-router';

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
    },
    data() {
        const languages: JSONObject = locales[this.$props.language];
        const locale: JSONValue = languages[this.$props.locale];

        const users = flatten<User>([], UsersData.data);
        const options: {[key:string]: string | boolean | object} = {
            tableClass: 'table',
            showCaption: true,
            showHeader: true,
            showFooter: false,
            render: {avatar: 'image'}
        };

        const content: {[key:string]: string | object | string[] | object[] | JSONValue} = {
            caption: 'Loaded from file user data',
            header: ['avatar', 'id', 'first_name', 'last_name', 'email', 'created_at', 'updated_at'],
            locale: locale,
            data: users,
        };

        return {
            content: content,
            options: options,
            path: useRoute().path
        };
    },
});

</script>

<template>
    <Table :options="options" :content="content" :url="path" />
</template>
