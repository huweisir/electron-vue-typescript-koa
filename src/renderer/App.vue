<template>
  <div id="app">
    <a-layout id="layout">
      <a-menu mode="vertical" class="nav" :theme="theme">
        <a-menu-item>
          <router-link to="/files">文件处理</router-link>
        </a-menu-item>
        <a-menu-item>
          <router-link to="/manage">抢票</router-link>
        </a-menu-item>
        <a-menu-item>
          <router-link to="/">账号删选</router-link>
        </a-menu-item>
      </a-menu>
      <a-layout>
        <a-layout-content :style="{ margin: '24px 16px 0' }">
          <div class="right-container">
            <router-view/>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: "electron-vue",
  data() {
    return {
      theme: "light"
    };
  },
  methods: {}
};
</script>

<style>
/* CSS */
.nav {
  /* height: 100vh; */
  position: fixed;
  left: 10px;
  top: 10px;
  width: 200px;
  border: 1px solid rgba(222, 199, 199, 0.6);
  border-radius: 2px;
}
.right-container {
  overflow: hidden;
  padding: 24px;
  background: #fff;
}
</style>
