<script lang="ts">
import { defineComponent } from 'vue';
import { flatten, visitor, recursiveHasAccess, type Route } from '@/functions/helpers';
// import * as Routes from '@/data/topmenuroutes.json';
import Routes from '@/data/topmenuroutes.json';
import Submenu from './Submenu.vue';
import IconHamburger from '../icons/IconHamburger.vue';
import IconDropdownArrow from '../icons/IconDropdownArrow.vue';

const allDropdowns: {[key: string]: boolean} = {};

export default defineComponent({
    name: 'Navbar',
    components: {
        Submenu,
        IconHamburger,
        IconDropdownArrow
    },
    data() {
        return {
            user: visitor,
            routes: Routes,
            showMenu: false,
            dropdowns: allDropdowns,
        }
    },
    methods: {
        toggleNav: function(): void {
            this.showMenu = !this.showMenu;
        },
        toggleDropdown: function(routeName: string): void {
            this.dropdowns[routeName] = this.dropdowns.hasOwnProperty(routeName) ? !this.dropdowns[routeName] : true;
        },
        toggleSubmenu(routeName: string): boolean {
            return this.dropdowns.hasOwnProperty(routeName) ? this.dropdowns[routeName] : false;
        },
    },
    computed: {
        menulist(): Route[] {
            return recursiveHasAccess(this.routes, this.user);
        }
    }
});
</script>

<template>
  <nav class="navbar sticky-top">
    <div class="nav-wrap">
        <button @click="toggleNav()"
                class="hamburger"
                type="button"
                aria-expanded="false"
                aria-label="Toggle navigation">
          <span class="[&>svg]:w-7">
            <IconHamburger />
          </span>
        </button>

        <div :class="[showMenu ? 'flex-row' : '!visible hidden']" class="nav-responsive">
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
                    <span v-if="route.hasChildren"
                          @click="toggleDropdown(route.name)"
                          class="dropdown">
                        <IconDropdownArrow />
                    </span>
                    <Submenu :toShow="toggleSubmenu(route.name)" :routes="route.children" />
                </template>
              </li>
          </ul>
        </div>
      </div>
  </nav>
</template>
