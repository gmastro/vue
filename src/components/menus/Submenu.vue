<script lang="ts" setup>
import { type Route } from '@/functions/helpers';

defineProps<{
  routes: Route[] | undefined,
  toShow: boolean
}>()

</script>

<template>
    <ul :class="[toShow ? 'block' : 'hidden']"
        class="absolute top-[2rem] right-[-2rem] z-[1000] m-0 min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700">
        <li v-for="(route, index) in routes" :key="route.name">
            <RouterLink :to="route.href"
                        class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600">{{ route.text }}</RouterLink>
        </li>
    </ul>
</template>