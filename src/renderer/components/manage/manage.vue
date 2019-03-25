<template>
  <div id="wrapper">
    <main>
      <iframe
        v-if="ifmsrc"
        id="iframe"
        :src="ifmsrc"
        @load="ifmLoad();"
        frameborder="0"
        width="750"
        height="800"
      ></iframe>
      <div class="right-side">
        <div class="doc">
          <div class="title">Started</div>
          <div>
            <label for>开始时间：</label>
            {{startTimeC}}
          </div>
          <div>
            <label for>抢票时间：</label>
            {{startTimeS}}
          </div>
          <br>
          <div>
            <button @click="reload();">刷新页面</button>
            <button @click="reset();">重置</button>
            <!-- <button @click="reload();">刷新页面</button> -->
          </div>
        </div>
        <br>
        <div class="doc">
          <div>
            <label for>输入链接</label>
            <input class="input" type="text" v-model="inputurl">
          </div>
          <br>
          <div>
            <label for>密码</label>
            <input
              class="input"
              type="text"
              v-model="password"
              @input="inputFunc($event,'password')"
            >
          </div>
          <br>
          <div>
            <label for>频率</label>
            <input
              class="input"
              type="text"
              v-model="frequency"
              @input="inputFunc($event,'frequency')"
            >
          </div>
          <br>
          <h3 style="color:red;">日志:</h3>
          <div class="log">{{log}}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from "../LandingPage/SystemInformation";
import Vue from "vue";
import http from "http";
import httpProxy from "http-proxy";
// require();
// import xx from "./s.vue";
// import {
//   setTimeout,
//   setImmediate,
//   clearTimeout,
//   setInterval,
//   clearInterval
// } from "timers";
import { scriptGetTicket, scriptPay } from "./script";
var MD5 = require("../../../lib/md5.js");
// import "https://code.jquery.com/jquery-3.3.1.min.js";

export default Vue.extend({
  name: "LandingPage",
  data() {
    return {
      ifm: null,
      _ifmDoc: null,
      _ifmWin: null,
      CBG_CONFIG: {},
      httpServer: null,
      startTime: 0, //开始时间
      //抢票链接
      href: "",
      //支付页链接
      href2: "",
      onpay: false,
      // 输出log
      log: "",
      // 输入链接
      inputurl: "",
      // 密码
      password: "",
      //频率默认100
      frequency: 100
    };
  },
  computed: {
    ifmsrc() {
      // debugger;
      var src = this.onpay ? this.href2 : this.href;
      this.onpay = false;
      return src;
    },
    startTimeS() {
      var start = new Date(this.startTime) + "";
      return start.replace(/\T|Z/g, "  ");
    },
    startTimeC() {
      var start = new Date(this.startTime + 2000) + "";
      return start.replace(/\T|Z/g, "  ");
    }
  },
  components: { SystemInformation },
  methods: {
    inputFunc(e, key) {
      localStorage[key] = e.target.value;
    },
    reset() {
      this.location.reload();
    },
    reload() {
      this.href = this.inputurl;
      var ifm = document.getElementById("iframe");
      ifm ? (ifm.src = this.href) : null;
    },
    addLog(_log) {
      this.log += `
      ${_log}`;
    },
    gotoPay(url) {
      console.log("gotopay===>", url);
      // return;
      this.onpay = true;
      this.href2 = url;
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    async get_equip_detail() {
      let res = await this.$http({
        url: "/get_equip_detail",
        method: "POST", // 默认是 get
        baseURL: "https://my.cbg.163.com/cgi/api/",
        headers: {
          // "cbg-safe-code": this.CBG_CONFIG.safeCode,
          cbg_flag: "https://my.cbg.163.com/cgi/api/",
          x_Referer: this.ifmsrc
        },
        params: {
          serverid: this.param.serverid,
          ordersn: this.param.ordersn,
          view_loc: "all_list"
        }
      });
      this.addOrder(res.data.equip);
    },
    //生成订单
    async addOrder(equip, sec) {
      let pwin = {
        //function
        showTime: this.showTime,
        gotoPay: this.gotoPay,
        addLog: this.addLog,
        // data
        infoParams: this.param
      };
      var param = {
        serverid: this.param.serverid,
        ordersn: this.param.ordersn,
        confirm_price_total: equip.price,
        view_loc: "msg"
      };
      let data = await this.$http({
        url: "/add_order",
        method: "POST", // 默认是 get
        baseURL: "https://my.cbg.163.com/cgi/api/",
        headers: {
          // "cbg-safe-code": this.CBG_CONFIG.safeCode,
          cbg_flag: "https://my.cbg.163.com/cgi/api/",
          x_Referer: this.ifmsrc
        },
        data: {
          serverid: this.param.serverid,
          ordersn: this.param.ordersn,
          view_loc: "all_list"
        }
      });
      var order = data.order;
      var log = "成功";
      if (data.msg) {
        log = data.msg;
      } else {
        // get_order_detail(order.orderid_to_epay);
        // get_order_pay_info(order.orderid_to_epay);
      }
      pwin.addLog("huwei log=> 下单：addOrder ===>  结果： " + log);
      sec ? sec() : null;
    },
    getParams() {
      if (this.inputurl) {
        this.href = this.inputurl;
      }
      let splitStr = this.href.split("equip");
      let dataHref =
        splitStr.length > 1 ? splitStr[1] : this.href.split("order/confirm")[1];
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
      this.param = param;
      this.get_equip_detail();
    },
    ifmLoad() {
      this.ifm = document.getElementById("iframe");
      let _ifmDoc = document.getElementById("iframe").contentDocument;
      let _ifmWin = document.getElementById("iframe").contentWindow;
      this._ifmDoc = _ifmDoc;
      this._ifmWin = _ifmWin;
      this.CBG_CONFIG = this._ifmWin.CBG_CONFIG || {};
      console.log(this._ifmWin);
      let script1 = document.createElement("script");
      script1.src = "https://code.jquery.com/jquery-3.3.1.min.js";
      // _ifmDoc.body.appendChild(script1);
      let script2 = document.createElement("script");
      if (this.onpay) {
        script2.text = scriptPay;
        let pwin = {
          //function
          // data
          infoParams: {
            password: this.password,
            frequency: this.frequency
          }
        };
        this._ifmWin.pwin = pwin;
        _ifmDoc.body.appendChild(script2);
      } else {
        this.getParams();
        var timer2 = setInterval(() => {
          // debugger;
          console.log("setInterval===> dasda");
          if (this.CBG_CONFIG.safeCode) {
            clearInterval(timer2);
          } else {
            this.CBG_CONFIG = this._ifmWin.CBG_CONFIG || {};
          }
        }, 100);
        let pwin = {
          //function
          showTime: this.showTime,
          gotoPay: this.gotoPay,
          addLog: this.addLog,
          // data
          infoParams: this.param
        };
        return;
        this._ifmWin.pwin = pwin;
        // debugger;
        script2.text = scriptGetTicket;
        // script2.innerText = "";
        _ifmDoc.body.appendChild(script2);
        _ifmWin.post = function() {
          // console.log("post+++>", _ifmWin.location.href);
          $.ajax({
            type: "post",
            url: "https://my.cbg.163.com/cgi/api/get_equip_detail"
          });
        };
      }
    },
    showTime(_time) {
      console.log("===>showTime", _time);
      this.startTime = _time;
    }
  },
  created() {
    this.frequency = localStorage["frequency"] || 100;
    this.password = localStorage["password"];
  },
  beforeDestroy() {
    // this.httpServer.end();
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
.right-side {
  margin-left: 10px;
  min-width: 280px;
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

label {
  min-width: 80px;
  display: inline-block;
  vertical-align: middle;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

.log {
  white-space: pre-line;
  font-size: 13px;
  word-break: break-all;
  max-width: 300px;
  max-height: 500px;
  overflow: auto;
}

.input {
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 5px;
  border: 1px solid #e3e3e3;
  color: #2c3e50;
  outline: none;
  border-radius: 5px;
  min-width: 220px;
  margin-right: 10px;
  transition: border-color 0.2s ease;
  background-size: 20px;
  vertical-align: middle !important;
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
  margin-top: 10px;
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
