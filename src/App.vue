<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/menus/Navbar.vue'

// export default defineComponent({
//   // setup() {
//   //   return {}
//   // },
//   components: {
//     HelloWorld,
//   },
//   props: {
//     name: String,
//     msg: {type: String, required: true}
//   },
//   data() {
//     return {
//       count: 1
//     }
//   },
//   mounted() {
//     this.name,
//     this.msg,
//     this.count
//   }
// });
</script>

<template>
  <Navbar />
  <article>
    <aside class="leading-6 max-h-screen md:flex md:pr-[calc(var(--section-gap)/2)]">
      <div class="md:flex md:place-items-start md:flex-wrap">
        <img alt="Vue logo" class="block mx-auto mb-8 md:m-0 md:mr-8" src="@/assets/logo.svg" width="125" height="125" />
        <HelloWorld msg="You did it!" />
      </div>
    </aside>

    <RouterView />
  </article>
</template>

<style scoped>
/*
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
*/
</style>
