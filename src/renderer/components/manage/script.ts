export const scriptGetTicket =
  `
  (function () {
    console.log("script2=====>");
    var equip;
    var info;
    setTimeout(() => {
      var pwin = window.pwin;
      var equip;
      var info;
      $.post(
        "https://my.cbg.163.com/cgi/api/get_equip_detail",
        {
          serverid: pwin.infoParams.serverid,
          ordersn: pwin.infoParams.ordersn,
          view_loc: "all_list"
        },
        function (data) {
          console.log(data);
          res(data);
        }
      );
    }, 100);
  
    function res(data) {
      //status 1-未上架，2-公示期,可买 ,3-被下单
      if (data.status == 1 && data.equip && data.equip.status == 2) {
        equip = data.equip || {};
        var fair_show_end_time = Date.parse(equip.fair_show_end_time);
        var now = Date.now();
        // 提前两秒开始
        var startTime = (fair_show_end_time - now - 4000);
        startTime = startTime > 0 ? startTime : 0;
        console.log(fair_show_end_time, startTime);
        //预设时间开始
        var timer2 = setTimeout(() => {
          if (startTime > 0) {
            //开始
            var time3 = setInterval(() => {
              addOrder(function () {
                clearInterval(time3);
              });
            }, pwin.infoParams.frequency);
            clearTimeout(timer2);
          } else {
            startTime = now;
            addOrder();
          }
        }, startTime);
        pwin.showTime(fair_show_end_time);
      } else {
        if (data.msg) pwin.addLog("huwei log=> get_equip_detail ===>  结果： " + data.msg);
        if (data.equip && data.equip.status_desc) pwin.addLog("huwei log=> get_equip_detail ===>  结果： " + data.equip.status_desc);
      }
    }
    //生成订单
    function addOrder(sec) {
      var param = {
        serverid: pwin.infoParams.serverid,
        ordersn: pwin.infoParams.ordersn,
        confirm_price_total: equip.price,
        view_loc: "msg"
      }
      $.ajax({
        url: '/cgi/api/add_order',
        method: 'POST',
        data: param,
        headers: {
          'Accept': "application/json, text/javascript, */*; q=0.01",
          'cbg-safe-code': CBG_CONFIG.safeCode,
        },
        success: function (data) {
          console.log("addOrder=====>", data);
          var order = data.order;
          var log = "成功";
          if (data.msg) {
            log = data.msg;
          } else {
            // get_order_detail(order.orderid_to_epay);
            get_order_pay_info(order.orderid_to_epay);
          }
          pwin.addLog("huwei log=> 下单：addOrder ===>  结果： " + log);
          sec ? sec() : null;
        }
      })
    }
  
    // https://my.cbg.163.com/cgi/api/get_order_detail?orderid_to_epay=171_5949
  
    //获取订单支付详情
    function get_order_detail(orderid_to_epay) {
      var param = {
        orderid_to_epay
      }
      $.ajax({
        url: '/cgi/api/get_order_detail',
        method: 'GET',
        data: param,
        headers: {
          'Accept': "application/json, text/javascript, */*; q=0.01",
          'cbg-safe-code': CBG_CONFIG.safeCode,
        },
        success: function (data) {
          console.log("get_order_detail =====> ", data.order);
          if (data.order && data.order.orderid_from_epay) {
            var epay_pay_url = "https://epay.163.com/cashier/m/standardCashier?orderId=" + data.order.orderid_from_epay + "#/1&key=INDEX";
            pwin.addLog("支付链接： " + epay_pay_url);
            pwin.gotoPay(epay_pay_url);
          } else {
            pwin.addLog("get_order_detail =====> 没有订单详情!");
  
          }
  
        }
      })
    }
  
    //获取订单支付详情
    function get_order_pay_info(orderid_to_epay) {
      var param = {
        orderid_to_epay
      }
      $.ajax({
        url: '/cgi/api/get_order_pay_info',
        method: 'POST',
        data: param,
        headers: {
          'Accept': "application/json, text/javascript, */*; q=0.01",
          'cbg-safe-code': CBG_CONFIG.safeCode,
        },
        success: function (data) {
          console.log("get_order_pay_info=====>", data.pay_info);
          var epay_pay_url = decodeURI(data.pay_info.epay_pay_url) + "#/1&key=INDEX";
          pwin.addLog("支付链接： " + epay_pay_url);
          pwin.gotoPay(epay_pay_url);
        }
      })
    }
  
  })();
      
`

export const scriptPay =
  `
    ; (function () {
        var timer = setInterval(() => {
          var payPassword = document.getElementById("payPassword");
          var activeBtn = document.getElementById("activeBtn")
          var pwin = window.pwin;
          if (payPassword && activeBtn && pwin) {
            payPassword.value = pwin.infoParams.password;
            activeBtn.click();
            clearInterval(timer);
          }
        }, 5)
      })();
`