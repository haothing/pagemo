<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <img class="pagemo-title-icon" src="icons/start_48.png" />
        <q-toolbar-title class="pagemo-title"> Pagemo </q-toolbar-title>
        <div>/* add memo and note in every pages. */</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    return {};
  },
});
</script>
<style>
.pagemo-title {
  flex: 0 1 auto;
  padding-left: 6px;
}
.pagemo-title-icon {
  width: 22px;
  height: 22px;
}
</style>
