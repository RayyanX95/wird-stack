<script setup lang="ts">
// The landing page brings its own chrome; every other route lives inside the
// app shell. Keyed on route meta rather than on the path so adding another
// bare route later is a one-line change in the router.
import AppShell from './components/layout/AppShell.vue';
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <!--
      Exactly one <Transition> is active at a time, and it always wraps the
      routed component directly.

      Both matter. Nesting a transition inside another one that is also in
      `out-in` mode makes the inner enter wait on the outer's leave, and a
      transition can only animate a single root element — so every routed view
      renders one root (see the `.view` class in main.css). Get either wrong
      and navigation leaves the content stuck mid-transition, invisible until
      a reload.
    -->
    <AppShell v-if="route.meta.layout !== 'bare'">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </AppShell>

    <Transition v-else name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>
