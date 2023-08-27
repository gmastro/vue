<script setup lang="ts">
import { RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/menus/Navbar.vue'
</script>

<template>
  <Navbar />
  <article>
    <aside>
      <div class="lg:flex lg:place-items-start lg:flex-wrap">
        <img alt="Vue logo" class="block mx-auto mb-8 lg:m-0 lg:mr-8" src="@/assets/logo.svg" width="125" height="125" />
        <HelloWorld msg="You did it!" />
      </div>
    </aside>

    <RouterView />
  </article>
</template>
