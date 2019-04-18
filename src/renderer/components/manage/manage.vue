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
            <button @click="reset();">刷新页面</button>
            <!-- <button @click="reset();">重置</button> -->
            <button @click="validate();">验证手机号</button>
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
            <label for>频率(次/ms)</label>
            <input
              class="input"
              type="text"
              v-model="frequency"
              @input="inputFunc($event,'frequency')"
            >
          </div>
          <br>
          <div>
            <label for>提前多少毫秒</label>
            <input
              class="input"
              type="text"
              v-model="advanceTime"
              @input="inputFunc($event,'advanceTime')"
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
import { scriptGetTicket, scriptPay } from "./script";
const { ipcRenderer } = require("electron");
const MD5 = require("../../../lib/md5.js");

export default Vue.extend({
  name: "LandingPage",
  data() {
    return {
      ifm: null,
      _ifmDoc: null,
      _ifmWin: null,
      CBG_CONFIG: {},
      // 是否是验证手机号
      validatePhoneCode: false,
      // 账号信息
      accountData: {},
      // 开始时间
      startTime: 0,
      // 抢票链接
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
      //频率默认100ms
      frequency: 10,
      // 提前多少时间开始刷接口
      advanceTime: 1000,
      payAmount: 0,
      // 易盾token
      yidunToken: "",
      antiSpam: null
    };
  },
  computed: {
    ifmsrc() {
      var src = this.onpay ? this.href2 : this.href;
      this.onpay = false;
      return src;
    },
    startTimeS() {
      var start = new Date(this.startTime - this.advanceTime) + "";
      return start.replace(/\T|Z/g, "  ");
    },
    startTimeC() {
      var start = new Date(this.startTime) + "";
      return start.replace(/\T|Z/g, "  ");
    }
  },
  components: { SystemInformation },
  methods: {
    inputFunc(e, key) {
      localStorage[key] = e.target.value;
    },
    initWatchman() {
      window.initWatchman({
        productNumber: "YD00000595128763", // 产品编号
        onload: instance => {
          this.antiSpam = instance;
          window.antiSpam = instance;
        },
        onerror: function(e) {}
      });
    },
    reset() {
      this.validatePhoneCode = false;
      this.reload();
    },
    //重载iframe
    reload() {
      this.href = this.inputurl;
      var ifm = document.getElementById("iframe");
      ifm ? (ifm.src = this.href) : null;
    },
    validate() {
      this.validatePhoneCode = true;
      this.reload();
    },
    //页面输出log
    addLog(_log) {
      this.log += `${_log}
      
      `;
    },
    //获取支付页面URL
    async getPayUrl(orderid_to_epay) {
      let url = orderid_to_epay
        ? await this.get_order_pay_info(orderid_to_epay)
        : null;
      console.log(url);
      if (url) {
        this.onpay = true;
        this.gotoPay(url);
      }
    },
    // iframe页面跳转
    gotoPay(url) {
      this.href2 = url;
    },
    //计时抢票
    async getTicket(equip) {
      const fair_show_end_time = equip.fair_show_end_time || 0;
      let onlineStartTime = Date.parse(fair_show_end_time);
      this.startTime = onlineStartTime;
      const nowTime = Date.now();
      // 订单到支付的ID
      let orderid_to_epay = "";
      const parse = onlineStartTime - nowTime;
      if (parse - ~~this.advanceTime > 0) {
        let account = 0;
        //开始时间，单位ms
        let startTime = parse - this.advanceTime;
        // 定时器
        var timerSetTime = setTimeout(() => {
          var timeSetInterval = setInterval(async () => {
            // 提交订单
            await this.addOrder(equip, orderid_to_epay => {
              //成功结束或者失败
              clearInterval(timeSetInterval);
              this.getPayUrl(orderid_to_epay);
            });
            //获取支付页面URL
            if (this.frequency * account - this.advanceTime > 1500) {
              //超时5秒自动结束
              clearInterval(timeSetInterval);
            }
            // 抢票次数，计数器
            account++;
          }, this.frequency);
          clearTimeout(timerSetTime);
        }, startTime);
      } else {
        await this.addOrder(equip, orderid_to_epay => {
          //成功结束或者失败
          this.getPayUrl(orderid_to_epay);
        });
        //获取支付页面URL
      }
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    async getStandardTime() {
      //校准时间搓，获取当前时间
      let res = await this.$http.get(
        "http://api.k780.com:88/?app=life.time&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json"
      );
      let nowTime = Date.now();
      if (res.data) {
        // 如果接口返回了时间，则用返回的时间，不然用当前本地时间
        nowTime = res.data.result
          ? res.data.result.timestamp || Date.now()
          : Date.now();
      }
      return nowTime;
    },
    //获取商品详情接口
    async get_equip_detail() {
      let res = await this.$http({
        url: "/get_equip_detail",
        method: "POST", // 默认是 get
        baseURL: "https://my.cbg.163.com/cgi/api/",
        headers: {
          "cbg-safe-code": this.CBG_CONFIG.safeCode,
          cbg_flag: "https://my.cbg.163.com/cgi/api/",
          x_Referer: this.ifmsrc
        },
        params: {
          serverid: this.param.serverid,
          ordersn: this.param.ordersn,
          view_loc: "all_list"
        }
      });
      let back;
      let resData = res.data || {};
      if (resData && resData.equip) {
        this.accountData = resData;
        back = res.data.equip;
      }
      return back;
    },
    //生成订单
    async addOrder(equip, callback) {
      let res = await this.$http({
        url: "/add_order",
        method: "POST", // 默认是 get
        baseURL: "https://my.cbg.163.com/cgi/api/",
        headers: {
          "cbg-safe-code": this.CBG_CONFIG.safeCode,
          my_info: JSON.stringify({
            Referer: this.ifmsrc, //referer
            Host: "my.cbg.163.com",
            Origin: "https://my.cbg.163.com"
          })
        },
        params: {
          serverid: this.param.serverid,
          confirm_price_total: equip.price,
          ordersn: this.param.ordersn,
          view_loc: "all_list"
        }
      });
      let resData = res.data || {};
      let log = "下单成功";
      let back;
      let orderid_to_epay;
      if (resData.msg) {
        log = resData.msg;
      } else {
        orderid_to_epay = resData.order.orderid_to_epay;
      }
      this.addLog("下单：addOrder ===> 结果：" + log + " " + new Date());
      if (callback && resData.status == 1 && orderid_to_epay) {
        if (callback) callback(orderid_to_epay || "");
      }
      return orderid_to_epay;
    },
    async my_orders() {
      let res = await this.$http({
        url: "/my_orders?page=1&status=1",
        method: "get", // 默认是 get
        baseURL: "https://my.cbg.163.com/cgi/api/",
        headers: {
          "cbg-safe-code": this.CBG_CONFIG.safeCode,
          my_info: JSON.stringify({
            Referer: this.ifmsrc, //referer
            Host: "my.cbg.163.com",
            Origin: "https://my.cbg.163.com"
          })
        }
      });
      let resData = res.data || {};
      let order = resData.result[0] || {};
      let serverid = order.serverid;
      let orderid = order.orderid;
      return `${serverid}_${orderid}`;
    },
    // 获取订单详情接口
    async cancel_order(orderid_to_epay) {
      let res = await this.$http({
        url: "/cancel_order",
        method: "POST", // 默认是 get
        baseURL: "https://my.cbg.163.com/cgi/api/",
        headers: {
          "cbg-safe-code": this.CBG_CONFIG.safeCode,
          my_info: JSON.stringify({
            Referer: this.ifmsrc, //referer
            Host: "my.cbg.163.com",
            Origin: "https://my.cbg.163.com"
          })
        },
        params: {
          orderid_to_epay
        }
      });
      let resData = res.data || {};
      // 取消成功
      let result = false;
      if (resData.status === 1) {
        result = true;
      }
      this.addLog("取消订单：cancel_order ===> 结果：" + resData.msg);
      return result;
    },
    // 获取订单详情接口
    async get_order_pay_info(orderid_to_epay) {
      let res = await this.$http({
        url: "/get_order_pay_info",
        method: "get", // 默认是 get
        baseURL: "https://my.cbg.163.com/cgi/api/",
        headers: {
          "cbg-safe-code": this.CBG_CONFIG.safeCode,
          my_info: JSON.stringify({
            Referer: this.ifmsrc, //referer
            Host: "my.cbg.163.com",
            Origin: "https://my.cbg.163.com"
          })
        },
        params: {
          orderid_to_epay,
          view_loc: "all_list"
        }
      });
      let data = res.data || {};
      // 拿到支付URL
      let url =
        data.pay_info && data.pay_info.epay_pay_url
          ? data.pay_info.epay_pay_url
          : "";
      this.onpay = true;
      return url;
    },
    // 获取页面信息的接口
    getParams() {
      if (this.inputurl) {
        this.href = this.inputurl;
      }
      let splitStr = this.href.split("equip");
      let dataHref =
        splitStr.length > 1 ? splitStr[1] : this.href.split("order/confirm")[1];
      let dataList = dataHref.split("/");
      // 拿到serverid
      let serverid = dataList[1];
      let dataInfo = dataList[2];
      // 拿到ordersn
      let ordersn = dataInfo.split("?")[0];
      let view_loc = "all_list";
      const param = {
        serverid,
        ordersn,
        view_loc
      };
      this.param = param;
    },
    // 选择支付方式
    async ajaxCoupons(orderId) {
      const data = {
        orderId,
        envData: JSON.stringify({ term: "wap" }),
        payMode: JSON.stringify({
          balanceAvailable: true,
          couponAvailable: true,
          quickPayAvailable: true,
          ebankAvailable: true
        }),
        proposal: JSON.stringify({ balance: { payAmount: this.payAmount } })
      };
      const time = Date.now();
      const params = {
        // 头部的一些信息
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
        "content-length": 149,
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        Referer: `https://epay.163.com/cashier/m/standardCashier?orderId=${orderId}`, //referer
        Host: "my.cbg.163.com",
        Origin: "https://epay.163.com"
      };
      return await this.$http({
        url: "/ajaxCoupons",
        method: "POST", // 默认是 get
        baseURL: "https://epay.163.com/cashier/m/",
        transformRequest: [
          // form data提交数据时的一种处理，防止405
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        headers: {
          my_info: JSON.stringify(params)
        },
        // 这边需要一个时间搓
        params: { v: time },
        // 这里是form data表单数据
        data
      });
    },
    // 支付接口
    async ajaxPay(orderId, payAmount, yidunToken) {
      const time = Date.now();
      var params = {
        // 头部的一些信息
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
        "content-length": 149,
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        Referer: `https://epay.163.com/cashier/m/standardCashier?orderId=${orderId}`, //referer
        Host: "my.cbg.163.com",
        Origin: "https://epay.163.com"
      };
      return await this.$http({
        url: "/ajaxPay",
        method: "POST", // 默认是 get
        baseURL: "https://epay.163.com/cashier/m/",
        transformRequest: [
          // form data提交数据时的一种处理，防止405
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        headers: {
          my_info: JSON.stringify(params)
        },
        // 这边需要一个时间搓
        params: { v: time },
        // 这里是form data表单数据
        data: {
          proposal: JSON.stringify({ orderId, balance: { payAmount } }),
          securityValid: JSON.stringify({}),
          envData: JSON.stringify({ term: "wap" }),
          yidunToken
        }
      });
    },
    // 付款接口
    async payOrder(orderId) {
      const time = Date.now();
      var params = {
        // 头部的一些信息
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
        "content-length": 149,
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        Referer: `https://epay.163.com/cashier/m/standardCashier?orderId=${orderId}`, //referer
        Host: "my.cbg.163.com",
        Origin: "https://epay.163.com"
      };
      return await this.$http({
        url: "/verifyPayItems",
        method: "POST", // 默认是 get
        baseURL: "https://epay.163.com/cashier/m/security/",
        transformRequest: [
          // form data提交数据时的一种处理，防止405
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        headers: {
          my_info: JSON.stringify(params)
        },
        // 这边需要一个时间搓
        params: { v: time },
        // 这里是form data表单数据
        data: {
          securityValid: JSON.stringify({
            shortPayPassword: MD5(this.password)
          }),
          orderId,
          envData: JSON.stringify({ term: "wap" })
        }
      });
    },
    async ifmLoad() {
      // iframe加载完成后执行逻辑
      /* ********  获取iframe的 window 和 document  ********** */
      this.ifm = document.getElementById("iframe");
      let _ifmDoc = document.getElementById("iframe").contentDocument;
      let _ifmWin = document.getElementById("iframe").contentWindow;
      this._ifmDoc = _ifmDoc;
      this._ifmWin = _ifmWin;
      /* *********************************************** */
      //判断是否是支付页面，不是支付页面（购买页面）时执行获取接口安全验证信息safecode
      if (this._ifmWin.location.href.indexOf("my.cbg.163.com") > -1) {
        this.CBG_CONFIG = this._ifmWin.CBG_CONFIG || {};
        this.getParams();
        let orderid_to_epay = await this.my_orders();
        await this.cancel_order(orderid_to_epay);
        // 在my.cbg.163.com这个域名下的时候，会去获取商品详情
        let equip = await this.get_equip_detail();
        this.payAmount = equip ? equip.price / 100 : 0;

        // 下单
        orderid_to_epay = equip ? await this.getTicket(equip) : null;
        var timer2 = setInterval(() => {
          if (this.CBG_CONFIG.safeCode) {
            // 如果安全码已存在，定时器结束
            clearInterval(timer2);
          } else {
            this.CBG_CONFIG = this._ifmWin.CBG_CONFIG || {};
          }
        }, 100);
      } else {
        let balanceLi = this._ifmDoc.getElementById("balanceLi");
        balanceLi.click();
      }
    },
    showTime(_time) {
      this.startTime = _time;
    },
    //初始化本地数据
    initLocal() {
      this.frequency = localStorage["frequency"] || 100;
      this.password = localStorage["password"];
      this.password = localStorage["password"];
    }
  },
  created() {
    var hubble = window.hubble || new window.HubbleUtil("pay", "payInfo");
    window.hubble = hubble;
    this.hubbleFun = function(eventId, ordid, pfid) {
      let other = {
        ordid,
        pfid
      };
      hubble.report(eventId, other);
    };
    this.getStandardTime();
    this.initWatchman();
    //初始化本地数据
    this.initLocal();
    ipcRenderer.on("asynchronous-reply", (event, arg) => {
      //渲染进程接收主进程响应回来的处理结果
      Object.keys(arg).forEach(ele => {
        const key = ele;
        switch (key) {
          case "orderId":
            //带了orderId时，需要调用支付接口
            let orderId = arg[key];
            if (this.validatePhoneCode) {
              //如果是验证手机号流程，展示不作处理
            } else {
              // 易盾token防作弊
              this.antiSpam.getToken(
                "1e334e244f2b46aa9acf4f707686cc23",
                async token => {
                  this.yidunToken = token;
                  this.hubbleFun("enter", {
                    ordid: orderId,
                    pfid: "2011101910PT16084831"
                  });
                  this.hubbleFun("payMethodClick", {
                    pagetitle: ` 余额（<span id="balanceAmount">${
                      this.payAmount
                    }</span>元） `,
                    ordid: orderId,
                    pfid: "2011101910PT16084831"
                  });
                  let res = await this.payOrder(orderId);
                  let resData = res.data || {};
                  this.addLog(
                    "支付：verifyPayItems ===> 结果：" + resData.result
                  );
                  await this.ajaxCoupons(orderId);
                  res = await this.ajaxPay(orderId, this.payAmount, token);
                  resData = res.data || {};
                  resData.errorMsg
                    ? this.addLog(
                        "支付：ajaxPay ===> 结果：" + resData.errorMsg
                      )
                    : this.addLog("支付：ajaxPay ===> 结果：" + resData.result);
                }
              );
            }
            break;
          default:
        }
      });
    });
  },
  beforeDestroy() {}
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
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
