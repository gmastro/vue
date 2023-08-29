<script lang="ts" setup>
import { type Route } from '@/functions/helpers';

defineProps<{
  routes: Route[] | undefined,
  toShow: boolean
}>()

</script>

<template>
    <ul :class="[toShow ? 'block' : 'hidden']">
        <li v-for="(route, index) in routes" :key="route.name">
            <RouterLink :to="route.href">{{ route.text }}</RouterLink>
        </li>
    </ul>
</template>