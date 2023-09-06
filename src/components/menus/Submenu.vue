<script lang="ts" setup>
import { type Route, toggleDropdown, toggleSubmenu } from '@/functions/helpers';
import IconDropdownArrow from '../icons/IconDropdownArrow.vue';

defineProps<{
  routes: Route[] | undefined,
  toShow: boolean
}>()

let menu: {[key: string]: boolean} = {};

</script>

<template>
    <ul :class="[toShow ? 'block' : 'hidden']">
        <li v-for="(route, index) in routes" :key="route.name">
            <RouterLink :to="route.href">{{ route.text }}</RouterLink>
            <div v-if="route.hasChildren"
                @click="toggleDropdown(route.name, menu)"
                 class="dropdown">
                <IconDropdownArrow />
                <Submenu :toShow="toggleSubmenu(route.name, menu)" :routes="route.children" />
            </div>
        </li>
    </ul>
</template>