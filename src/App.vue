<script setup lang="ts">
import { RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/menus/Navbar.vue'
</script>

<template>
  <Navbar />
  <article>
    <aside>
      <div class="md:flex md:place-items-start md:flex-wrap">
        <img alt="Vue logo" class="block mx-auto mb-8 md:m-0 md:mr-8" src="@/assets/logo.svg" width="125" height="125" />
        <HelloWorld msg="You did it!" />
      </div>
    </aside>

    <RouterView />
  </article>
</template>
