<template>
  <div id="app">
    <div class="navigator">
      <ul>
        <li>
          <router-link to="/">home</router-link>
        </li>
        <li>
          <router-link to="/list">list</router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "electron-vue"
};
</script>

<style>
/* CSS */
.navigator {
  position: fixed;
  right: 10px;
  top: 10px;
}
</style>
