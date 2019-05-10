<template>
  <div id="wrapper">
    <main>
      <div class>
        <!-- <XlsOps></XlsOps> -->
        <div class="continer">
          <XlsOps/>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import XlsOps from "./files/XlsOps.vue";
import Vue from "vue";

export default Vue.extend({
  name: "files",
  components: { XlsOps },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
});
</script>
 <style lang="scss">
@import "~@material/button/mdc-button.scss";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.continer {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
