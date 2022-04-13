<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <img class="pagemo-title-icon" src="icons/start_48.png" />
        <q-toolbar-title class="pagemo-title">{{
          msg.locale.app_name
        }}</q-toolbar-title>
        <div class="pagemo-description">{{ msg.locale.app_description }}</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import msg from "src/i18n";

export default defineComponent({
  name: "MainLayout",
  setup() {
    return { msg };
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
.pagemo-description {
  font-size: 12px;
  font-family: "Arial", -apple-system, Ubuntu, "メイリオ", "ＭＳ Ｐゴシック",
    "Microsoft YaHei", "DengXian";
}
</style>
