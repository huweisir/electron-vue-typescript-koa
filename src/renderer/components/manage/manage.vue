<template>
  <div id="wrapper">
    <main>
      <iframe
        v-if="ifmsrc"
        id="iframe"
        :src="ifmsrc"
        @load="ifmLoad();"
        frameborder="0"
        width="530"
        height="750"
      ></iframe>
      <div class="right-side">
        <div class="doc">
          <div>{{"VISION: 1.0.5"}}</div>
          <br />
          {{currentUrl}}
          <div class="title">
            <span>剩余：{{(startTimeLeft)|timerFormat}}</span>
          </div>
          <div>
            <a-checkbox :checked="useNetTime" @change="onChange">是否网络对时</a-checkbox>
          </div>
          <div>
            <label for>开始时间：</label>
            {{startTimeC}}
            <span style="margin-left:10px;"></span>
          </div>
          <div>
            <label for>抢票时间：</label>
            {{startTimeS}}
          </div>
          <br />
          <div>
            <button class="btn-primary" @click="reset();">刷新页面</button>
            <button class="btn-primary" @click="validate();">验证手机号</button>
            <button class="btn-primary" @click="loginBtn();">登录</button>
          </div>
        </div>
        <br />
        <div class="doc">
          <div class="form-item">
            <label for>输入链接</label>
            <input class="input" type="text" v-model="inputUrl" />
          </div>
          <div class="form-item">
            <label for>账号</label>
            <input class="input" type="text" v-model="user" @input="inputFunc($event,'user')" />
          </div>
          <div class="form-item">
            <label for>登录密码</label>
            <input
              class="input"
              type="text"
              v-model="loginPassword"
              @input="inputFunc($event,'loginPassword')"
            />
          </div>
          <div class="form-item">
            <label for>付款密码</label>
            <input
              class="input"
              type="text"
              v-model="password"
              @input="inputFunc($event,'password')"
            />
          </div>
          <div class="form-item">
            <label for>频率(次/ms)</label>
            <input
              class="input"
              type="text"
              v-model="frequency"
              @input="inputFunc($event,'frequency')"
            />
          </div>
          <div class="form-item">
            <label for>提前多少毫秒</label>
            <input
              class="input"
              type="text"
              v-model="advanceTime"
              @input="inputFunc($event,'advanceTime')"
            />
          </div>
          <br />
          <h3 style="color:red;">日志:</h3>
          <div class="log" v-html="log"></div>
        </div>
      </div>
    </main>
    <!-- <div class="right-side" v-else>
      <div class="doc">
        <div>{{"VISION : beta"}}</div>老哥 软件过期啦
      </div>
    </div>-->
  </div>
</template>

<script>
import Vue from "vue";
import http from "http";
import httpProxy from "http-proxy";
import { ajaxPay, payOrder, ajaxCoupons } from "./ajax/payAjax.ts";
import { getTimestamp } from "./ajax/other.ts";
import {
  get_order_pay_info,
  get_equip_detail,
  add_order,
  my_orders,
  cancel_order
} from "./ajax/order.ts";
import { formatTime, formatHour } from "../../common/toolFunction.ts";
import { lastDate } from "../../config/config";
const { ipcRenderer } = require("electron");
import { mapActions, mapState } from "vuex";
var { remote } = require("electron");

// remote.dialog.showErrorBox("title", "content");

const defaultUrl = "https://my.cbg.163.com/cgi/mweb/index";
const loginUrl = "https://my.cbg.163.com/cgi/mweb/user";

export default Vue.extend({
  data() {
    return {
      ifm: null,
      _ifmDoc: null,
      _ifmWin: null,
      autoLogin: false,
      CBG_CONFIG: {},
      // 是否是验证手机号
      validatePhoneCode: false,
      // 开始时间
      startTime: 0,
      //
      startTimeLeft: 0,
      //剩余时间计时器
      leftInterTimer: null,
      //抢票的计时器
      addorderInterTimer: null,
      // 开始抢票计时器
      startAddOrderTime: null,
      // 抢票链接
      href: defaultUrl,
      //支付页链接
      href2: "",
      onpay: false,
      // 输出log
      log: "",
      // 过期日期
      lastDate: lastDate,
      today: Date.now(),
      // 输入链接
      inputUrl: "",
      // 是否使用网络对时
      useNetTime: false,
      // 密码
      password: "",
      // 用户
      user: "",
      // 登录密码
      loginPassword: "",
      //频率默认100ms
      frequency: 40,
      // 提前多少时间开始刷接口
      advanceTime: 200,
      payAmount: 0,
      // 易盾token
      yidunToken: "",
      antiSpam: null,
      orderTime: 0,
      payTime: 0
      // ajaxPay,
      // payOrder
    };
  },
  computed: {
    // vuex接入state
    ifmsrc() {
      var src = (this.onpay ? this.href2 : this.href) || defaultUrl;
      this.onpay = false;
      return src;
    },
    currentUrl() {
      return this._ifmWin ? this._ifmWin.location.href : "";
    },
    startTimeS() {
      var start = new Date(this.startTime - this.advanceTime);
      return this.formatTime(start);
    },
    startTimeC() {
      var start = new Date(this.startTime);
      return this.formatTime(start);
    },

    // 是否过期
    Expired() {
      return this.today > this.lastDate;
    },
    ...mapState(["iframeSrc", "safeCode"])
  },
  filters: {
    timerFormat: function(value) {
      const x = formatHour(value);
      return x;
    }
  },
  methods: {
    // 获取订单需要支付的信息，如支付页面
    get_order_pay_info,
    get_equip_detail,
    add_order,
    my_orders,
    cancel_order,
    /***********          *************/
    //
    /***********  支付ajax *************/
    ajaxPay,
    payOrder,
    ajaxCoupons,
    /***********            *************/
    /*********** other ajax *************/
    getTimestamp,
    //
    // vuex接入action
    // ...[],
    ...mapActions(["updateSafeCode", "updateIframeSrc"]),
    // 时间格式化
    formatTime,
    formatHour,
    inputFunc(e, key) {
      localStorage[key] = e.target.value;
    },
    // 初始化watchman
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
    // 刷新页面
    reset() {
      this.validatePhoneCode = false;
      this.href = this.inputUrl || defaultUrl;
      this.reload(this.href);
    },
    //重载iframe
    reload(_href) {
      this.stopADD = true;
      //?????????
      var ifm = document.getElementById("iframe");
      ifm ? (ifm.src = _href) : null;
    },
    validate() {
      this.validatePhoneCode = true;
      this.reload();
    },
    loginBtn() {
      this.href = loginUrl;
      this.reload(loginUrl);
    },
    //页面输出log
    addLog(_log) {
      this.log += `${_log}
      
      `;
    },
    //获取支付页面URL
    async getPayUrl(orderid_to_epay) {
      this.addLog("跳转id===>" + orderid_to_epay);
      // 获取订单需要支付的信息，如支付页面
      let url = orderid_to_epay
        ? await this.get_order_pay_info(
            orderid_to_epay,
            this.ifmsrc,
            this.CBG_CONFIG.safeCode
          )
        : null;
      if (url) {
        this.addLog("跳转url===>" + url);
        this.onpay = true;
        // 跳转支付页面
        this.gotoPay(url);
      }
    },
    // iframe页面跳转
    gotoPay(url) {
      this.href2 = url;
    },
    onChange(e) {
      this.useNetTime = e.target.checked || false;
      this.reset();
    },
    //计时抢票
    async getTicket(equip, advanceTime) {
      const fair_show_end_time = equip.fair_show_end_time || 0;
      let onlineStartTime = Date.parse(fair_show_end_time);
      // test 使用
      // let onlineStartTime = Date.now() + 8000;
      this.startTime = onlineStartTime;
      let nowTime = Date.now();
      if (this.useNetTime) {
        let netTime = await this.getTime();
        nowTime = +newTime;
      }
      // 订单到支付的ID
      let orderid_to_epay = "";
      // 开始上架时间 - 现在的时间
      const parse = onlineStartTime - nowTime;
      if (parse - ~~advanceTime > 0) {
        let account = 0;
        // 开始抢票时间段，单位ms
        let startTimeCha = parse - advanceTime;
        // 显示剩余时间
        this.leftTime(startTimeCha);
        // ajax addOrder 守卫
        let addOrderStop = false;
        this.stopADD = false;
        // 定时器
        this.startAddOrderTime = setTimeout(() => {
          this.addorderInterTimer = setInterval(async () => {
            account++;
            if (this.frequency * account - advanceTime > this.frequency * 2) {
              //超时第二次自动结束
              clearInterval(this.addorderInterTimer);
              return;
            }
            // 提交订单
            addOrderStop = true;
            let orderid_to_epay = await this.addOrder(
              equip,
              orderid_to_epay => {
                //成功结束或者失败
                clearInterval(this.addorderInterTimer);
                this.getPayUrl(orderid_to_epay);
              }
            );
            if (orderid_to_epay) {
              clearInterval(this.addorderInterTimer);
              return;
            }
            // ajax 请求结束
            addOrderStop = false;
            // 抢票次数，计数器
          }, this.frequency);
          clearTimeout(this.startAddOrderTime);
        }, startTimeCha);
      } else {
        await this.addOrder(equip, orderid_to_epay => {
          //成功结束或者失败
          this.getPayUrl(orderid_to_epay);
        });
      }
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    //生成订单
    async addOrder(equip, callback) {
      this.addLog(
        `<b><span style="color:red;">开始下单：addOrder ===></span> </b>` +
          this.formatTime(new Date())
      );
      let res = await this.add_order(
        equip,
        this.param.serverid,
        this.param.ordersn,
        this.ifmsrc,
        this.CBG_CONFIG.safeCode
      );
      let resData = res.data || {};
      let log = "下单成功";
      let back;
      let orderid_to_epay;
      if (resData.msg) {
        log = resData.msg;
      } else {
        // 如果下单成功了，就返回一个orderid_to_epay
        orderid_to_epay = resData.order.orderid_to_epay;
        this.orderTime = Date.now();
        this.addLog(
          `<b><span style="color:red;">下单接口完成</span>(时间搓) === > ${this.orderTime}</b>`
        );
      }
      this.addLog(
        "下单：addOrder ===> 结果：" + log + " " + this.formatTime(new Date())
      );
      if (!this.stopADD && callback && resData.status == 1 && orderid_to_epay) {
        // 下城成功守卫
        this.stopADD = true;
        if (callback) callback(orderid_to_epay || "");
      }
      return orderid_to_epay;
    },
    async myOrders() {
      let res = await this.my_orders(this.ifmsrc, this.CBG_CONFIG.safeCode);
      let resData = res.data || {};
      if (resData.msg) {
        // 错误状态
        this.addLog("我的订单：my_orders ===> 结果：" + resData.msg);
        return "";
      }
      let order = resData.result[0];
      if (!order) {
        // 没有订单
        this.addLog("我的订单：my_orders ===> 结果：没有订单");
        return "";
      }
      // 状态-代付款
      let status_desc = order.status_desc;
      let subtitle = order.subtitle;
      this.addLog(
        `我的订单：my_orders ===> 结果：${status_desc} : ${subtitle} `
      );
      let orderid_to_epay = order.orderid_to_epay;
      return orderid_to_epay;
    },
    // 获取订单详情接口
    async cancelOrder(orderid_to_epay) {
      let res = await this.cancel_order(
        orderid_to_epay,
        this.ifmsrc,
        this.CBG_CONFIG.safeCode
      );
      let resData = res.data || {};
      // 取消成功
      let result = false;
      if (resData.status === 1) {
        result = true;
      }
      this.addLog("取消订单：cancel_order ===> 结果：" + resData.msg);
      return result;
    },
    // 获取页面信息的接口
    getParams() {
      if (this.inputUrl) {
        this.href = this.inputUrl;
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
    async getTime() {
      // 淘宝对时
      let res = await this.getTimestamp();
      let resData = res.data || {};
      let data = resData.data || {};
      let t = data.t || 0;
      return t;
    },
    loginFom(form) {
      if (this.user && this.loginPassword) {
        form.email.value = this.user || "";
        form.password.value = this.loginPassword || "";
      }
    },
    loginFunc(_href = "") {
      let dom = "normal";
      let _document = this._ifmDoc;
      if (!_href) {
        dom = null;
      }
      if (_href.indexOf("mweb/user") > -1) {
        //点击登陆
        dom = _document.querySelector(".primary");
        if (dom) dom.click();
      } else if (_href.indexOf("show_login") > -1) {
        var timerX = setTimeout(() => {
          //账号密码输入
          let ifmSon = _document.querySelector("iframe");
          let ifmSonDom = ifmSon.contentDocument;
          var head = ifmSonDom.querySelector(".u-head1 ");
          if (head) {
            head.click();
          }
          dom = ifmSonDom.getElementById("login-form");
          if (dom) {
            this.loginFom(dom);
            dom.querySelector(".u-loginbtn").click();
          }
          clearTimeout(timerX);
        }, 800);
      } else if (_href.indexOf("show_license") > -1) {
        dom = _document.getElementById("check_accept");
        if (dom) {
          dom.checked = true;
          _document.querySelector(".btn").click();
        }
      }
      return dom;
    },
    async ifmLoad() {
      //初始化数据及一些定时器
      this.destroyTimer();
      this.initData();
      // iframe加载完成后执行逻辑
      /* ********  获取iframe的 window 和 document  ********** */
      let _ifmDoc = document.getElementById("iframe").contentDocument;
      let _ifmWin = document.getElementById("iframe").contentWindow;
      this._ifmDoc = _ifmDoc;
      this._ifmWin = _ifmWin;
      let _location = this._ifmWin.location || "";
      /* *********************************************** */
      //判断是否是支付页面，不是支付页面（购买页面）时执行获取接口安全验证信息safecode
      if (_location.href.indexOf("my.cbg.163.com") > -1) {
        let dom = this.loginFunc(_location.href);
        if (dom !== "normal") {
          //进入登陆
          let account = 0;
          let timerx = setInterval(() => {
            _location = this._ifmWin.location || "";
            dom = this.loginFunc(_location.href);
            if (dom) {
              clearInterval(timerx);
            } else {
              if (account > 4) {
                // 0-4最多5次
                clearInterval(timerx);
              } else {
                account++;
              }
            }
          }, 500);
          return;
        }
        this.CBG_CONFIG = this._ifmWin.CBG_CONFIG || {};
        this.updateSafeCode(this.CBG_CONFIG.safeCode);
        this.getParams();
        let orderid_to_epay = await this.myOrders();
        // 存在订单就取消对应的订单;
        if (orderid_to_epay) await this.cancelOrder(orderid_to_epay);
        // 在my.cbg.163.com这个域名下的时候，会去获取商品详情
        let equip = await this.get_equip_detail(
          this.param.ordersn,
          this.ifmsrc,
          this.param.serverid,
          this.CBG_CONFIG.safeCode
        );
        // 支付金额
        this.payAmount = equip ? equip.price / 100 : 0;
        // 下单ID
        orderid_to_epay = equip
          ? await this.getTicket(equip, this.advanceTime)
          : null;
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
    //清除定时器
    destroyTimer() {
      if (this.leftInterTimer) {
        clearInterval(this.leftInterTimer);
      }
      if (this.addorderInterTimer) {
        clearInterval(this.addorderInterTimer);
      }
      if (this.startAddOrderTime) {
        clearInterval(this.addorderInterTimer);
      }
    },
    initData() {
      //初始化剩余时间
      this.startTimeLeft = 0;
      this.startTime = 0;
    },
    //初始化本地数据
    initLocal() {
      this.frequency = localStorage["frequency"] || 40;
      this.password = localStorage["password"];
      this.loginPassword = localStorage["loginPassword"];
      this.user = localStorage["user"];
    },
    //剩余时间计算
    leftTime(time) {
      let leftSec = time / 1000;
      this.leftInterTimer = setInterval(() => {
        this.startTimeLeft = leftSec--;
        if (this.startTimeLeft == 0) {
          clearTimeout(this.leftInterTimer);
        }
        if (+this.startTimeLeft === 60) {
          this.reset();
        }
      }, 1000);
    }
  },
  beforeDestroy() {
    this.destroyTimer();
    this.initData();
  },
  async created() {
    this.destroyTimer();
    this.initData();
    this.getTime();
    this.initWatchman();
    this.ifm = document.getElementById("iframe");
    //初始化本地数据
    this.initLocal();
    ipcRenderer.on("asynchronous-reply", (event, arg) => {
      this.addLog("asynchronous-reply===>");
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
                  this.addLog(
                    "进入支付页面---开始支付：verifyPayItems ===> 结果：" +
                      Date.now()
                  );
                  let res = await this.payOrder(orderId, this.password);
                  let resData = res.data || {};
                  this.addLog(
                    "支付：verifyPayItems ===> 结果：" + resData.result
                  );
                  // await this.ajaxCoupons(orderId, this.payAmount);
                  res = await this.ajaxPay(orderId, this.payAmount, token);
                  resData = res.data || {};
                  this.payTime = Date.now();
                  this.addLog(
                    `<b><span style="color:red;">付款接口完成</span>(时间搓) === > ${this.payTime}</b>`
                  );
                  var cha = parseInt(this.payTime) - parseInt(this.orderTime);
                  resData.errorMsg
                    ? this.addLog(
                        `支付：ajaxPay ===> 结果：<span style="color:red;">${resData.errorMsg}</span>`
                      )
                    : this.addLog(
                        `支付：ajaxPay ===> 结果：<span style="color:red;">${resData.result}</span>`
                      );
                  this.addLog(
                    `<b>下单--付款 <span style="color:red;">时间花费</span> === > ${cha}ms</b>`
                  );
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
//
</script>
 <style  src="./manage.scss" lang="scss"  scoped></style>
