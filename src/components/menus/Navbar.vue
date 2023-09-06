<script lang="ts">
import { defineComponent, ref } from 'vue';
import { visitor, recursiveHasAccess, recursiveInitSubmenu } from '@/functions/helpers';
// import * as Routes from '@/data/topmenuroutes.json';
import Routes from '@/data/topmenuroutes.json';
import IconHamburger from '../icons/IconHamburger.vue';
import IconDropdownArrow from '../icons/IconDropdownArrow.vue';
import DropdownMenu from './DropdownMenu.vue';

export default defineComponent({
    name: 'Navbar',
    components: {
        IconHamburger,
        IconDropdownArrow,
        DropdownMenu
    },
    data() {
        const menulist = recursiveHasAccess(Routes, visitor);
        const menu: {[key: string]: boolean} = recursiveInitSubmenu(menulist);

        return {
            showResponsive: false,
            menulist: menulist,
            menu: menu,
        }
    },
    methods: {
        responsiveNav: function(): void {
            this.showResponsive = !this.showResponsive;
        },
        handleToggleDropdown: function(routeName: string): void {
            this.menu[routeName] = this.menu.hasOwnProperty(routeName) ? !this.menu[routeName] : true;
        },
    },
});
</script>

<template>
  <nav class="navbar sticky-top">
    <div class="nav-wrap">
        <button @click="responsiveNav()"
                class="hamburger"
                type="button"
                aria-expanded="false"
                aria-label="Toggle navigation">
          <span class="[&>svg]:w-7">
            <IconHamburger />
          </span>
        </button>

        <div :class="[showResponsive ? 'flex-row' : '!visible hidden']" class="nav-responsive">
          <ul class="nav-left">
              <li v-for="(route, index) in menulist" :key="route.name">
                <template v-if="route.isBrand">
                    <RouterLink :to="route.href">
                        <img alt="Vue logo" class="block mr-4 lg:m-0" src="@/assets/logo.svg" width="24"/>
                    </RouterLink>
                </template>
                <template v-else>
                    <RouterLink :to="route.href">
                        {{ route.text }}
                    </RouterLink>
                    <DropdownMenu v-if="route.hasChildren" :parent="route" :menu="menu" @toggle-dropdown="handleToggleDropdown" />
                </template>
              </li>
          </ul>
        </div>
      </div>
  </nav>
</template>
