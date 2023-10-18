<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { PaginateRanges, PagerNodes } from '@/interfaces/options';

export default defineComponent({
    name: 'PagerSummary',
    props: {
        ranges: {
            type: Object as PropType<PaginateRanges>,
            required: true,
        },
    },
});
</script>

<template>
    <div class="summary">
        Displaying {{ ranges.items }} results per page. Range {{ ranges.from }} - {{ ranges.to }} out of {{ ranges.total }}
    </div>
</template>