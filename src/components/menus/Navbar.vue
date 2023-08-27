<script lang="ts">
import { defineComponent } from 'vue';
import { flatten, visitor, recursiveHasAccess, type Route } from '@/functions/helpers';
// import * as Routes from '@/data/topmenuroutes.json';
import Routes from '@/data/topmenuroutes.json';
import Submenu from './Submenu.vue';

const allDropdowns: {[key: string]: boolean} = {};

export default defineComponent({
    name: 'Navbar',
    components: {
        Submenu,
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
    <div class="wrap">
        <button @click="toggleNav()"
                class="hamburger"
                type="button"
                aria-expanded="false"
                aria-label="Toggle navigation">
          <span class="[&>svg]:w-7">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7">
              <path fill-rule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                    clip-rule="evenodd" />
            </svg>
          </span>
        </button>

        <div :class="[showMenu ? 'flex-row' : '!visible hidden']" class="mt-2 flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto">
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
                          class="ml-1 w-2">
                        <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="h-5 w-5">
                            <path fill-rule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clip-rule="evenodd" />
                        </svg>
                    </span>
                    <Submenu :toShow="toggleSubmenu(route.name)" :routes="route.children" />
                </template>
              </li>
          </ul>
        </div>
      </div>
  </nav>
</template>
