<script lang="ts">
import { defineComponent } from 'vue';
import { Pager, Paginate, type PagerNodes, paging } from '@/classes/Paginator';

export default defineComponent({
    name: 'PagesNav',
    props: {
        pages: {
            type: Paginate,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    setup(props, context) {
        const pages = props.pages;
        const options = {...paging, url: props.url};

        return {
            pages,
            options,
        };
    },
    computed: {
        listPages: function(): PagerNodes[] {
            const pager = new Pager(this.pages, this.options);
            return pager.getContent();
        },
        range: function(): {items: bigint, from: bigint, to: bigint, total: bigint} {
            return this.pages.getRange();
        }
    },
});
</script>

<template>
    <div class="pager">
        <div class="summary">
            Displaying {{ range.items }} results per page. Range {{ range.from }} - {{ range.to }} out of {{ range.total }}
        </div>
        <ul class="pager">
            <li v-for="(page, index) in listPages" :key="index">
                <RouterLink :class="[page.active ? '' : 'disabled']" :to="page.link">
                    <span v-html="page.text"></span></RouterLink>
            </li>
        </ul>
    </div>
</template>
