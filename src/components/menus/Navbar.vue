<script lang="ts">
import { computed, defineComponent } from 'vue';
import { flatten, visitor, hasAccess, Route } from '@/functions/helpers';
import * as Routes from '@/data/topmenuroutes.json';

export default defineComponent({
    data() {
        return {
            user: visitor,
            routes: Routes.default,
            showMenu: false
        }
    },
    methods: {
        toggleNav: function(): void {
            this.showMenu = !this.showMenu;
        }
    },
    computed: {
        menulist(): Route[] {
            return this.routes.filter( (r: Route) => hasAccess(r, this.user));
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
                  <RouterLink :to="route.href">{{ route.text }}</RouterLink>
              </li>
          </ul>
        </div>
      </div>
  </nav>
</template>
