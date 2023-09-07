<script lang="ts">
import IconDropdownArrow from '../icons/IconDropdownArrow.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DropdownMenu',
    components: {
        IconDropdownArrow,
    },
    props: ['parent', 'menu'],
    emits: {
        "toggle-dropdown": (routerName: string) => true
    },
    setup(props, context) {
        const handleToggleDropdown = (e: Event) => {
            context.emit('toggle-dropdown', props.parent.name);
        }
        
        return {
            handleToggleDropdown
        };
    },
    methods: {
        toggleDropdown: function(routeName: string): void {
            this.menu[routeName] = this.menu.hasOwnProperty(routeName) ? !this.menu[routeName] : true;
        },
    }
});

</script>

<template>
    <div class="dropdown" @click.stop="toggleDropdown(parent.name)">
        <IconDropdownArrow />
        <ul :class="[menu[parent.name] ? 'block' : 'hidden']">
            <li v-for="(route, index) in parent.children" :key="route.name">
                <RouterLink :to="route.href">{{ route.text }}</RouterLink>
                <DropdownMenu v-if="route.hasChildren" :menu="menu" :parent="route" @toggle-dropdown="handleToggleDropdown" />
            </li>
        </ul>
    </div>
</template>