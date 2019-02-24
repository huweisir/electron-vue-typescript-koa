<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <iframe :src="href" @load="ifmLoad();" frameborder="0" width="750" height="800"></iframe>
      <div class="right-side">
        <div class="doc">
          <div class="title">Getting Started</div>
          <button @click="get_equip_detail();">Read the Docs</button>
          <br>
          <br>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from "../LandingPage/SystemInformation";
import Vue from "vue";
import { setTimeout, setImmediate, clearTimeout } from "timers";
// import "https://code.jquery.com/jquery-3.3.1.min.js";

export default Vue.extend({
  name: "LandingPage",
  data() {
    return {
      ifm: null,
      ifmDoc: null,
      href:
        "https://my.cbg.163.com/cgi/mweb/equip/105/201902131101716-105-M740CVAEL4MY?view_loc=search"
    };
  },
  components: { SystemInformation },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    ifmLoad() {
      this.ifm = $("iframe")[0];
      let ifmDoc = $("iframe")[0].contentWindow;
      console.log(ifmDoc);
    },
    async get_equip_detail() {
      try {
        let dataHref = this.href.split("equip")[1];
        let dataList = dataHref.split("/");
        let serverid = dataList[1];
        let dataInfo = dataList[2];
        let ordersn = dataInfo.split("?")[0];
        let view_loc = "all_list";
        const param = {
          serverid,
          ordersn,
          view_loc
        };
        // const host = "https://my.cbg.163.com/cgi";
        const url = "/api/get_equip_detail";
        // console.log("===>", this.$http.post);
        var x = await this.$http.post(url, param);
        alert(JSON.stringify(x.data));
        // this.$http.post(url, param);
      } catch (e) {
        console.log("===>", e);
        alert(e);
      }
    }
  },
  created() {
    // this.get_equip_detail();
  }
});
</script>
 <style lang="scss">
@import "~@material/button/mdc-button.scss";
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
  /* @include mdc-button-ink-color(teal); */
  /* @include mdc-states(teal); */
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
