<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import PagerSummary from '@/components/tables/PagerSummary.vue';
import type { PaginateRanges, PagerNodes } from '@/interfaces/options';

export default defineComponent({
    name: 'PagesNav',
    components: {
        PagerSummary,
    },
    props: {
        ranges: {
            type: Object as PropType<PaginateRanges>,
            required: false,
        },
        content: {
            type: Array<PagerNodes>,
            required: true,
        },
    },
});
</script>

<template>
    <div class="pager">
        <PagerSummary v-if="$props.ranges" :ranges="$props.ranges" />
        <ul class="pager">
            <li v-for="(page, index) in content" :key="index">
                <RouterLink :class="[page.active ? '' : 'disabled']" :to="page.link">
                    <span v-html="page.text"></span></RouterLink>
            </li>
        </ul>
    </div>
</template>
