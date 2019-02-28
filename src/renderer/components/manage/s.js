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
    if (data.status) {
      equip = data.equip || {};
      var fair_show_end_time = Date.parse(equip.fair_show_end_time);
      var now = Date.now();
      // 提前两秒开始
      var startTime = (fair_show_end_time - now - 2000);
      console.log(fair_show_end_time, startTime);
      // debugger
      if (startTime) {
        //预设时间开始
        var timer2 = setTimeout(() => {
          //开始
          var time3 = setInterval(() => {
          }, pwin.infoParams.frequency);
          addOrder(function () {
            clearInterval(time3);
          });
          clearTimeout(timer2);
        }, fair_show_end_time);
      } else {
        startTime = now;
        addOrder();
      }
      pwin.showTime(fair_show_end_time);
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
          get_order_pay_info(order.orderid_to_epay);
        }
        pwin.addLog(log);
        sec();
      }
    })
  }

  //生成订单
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
        var epay_pay_url = decodeURI(data.pay_info.epay_pay_url)
        pwin.gotoPay(epay_pay_url);
      }
    })
  }

  //生成订单
  function previewOrder() {
    var param = {
      serverid: pwin.infoParams.serverid,
      ordersn: pwin.infoParams.ordersn,
    }
    $.ajax({
      url: '/cgi/api/preview_order',
      method: 'POST',
      data: param,
      headers: {
        'Accept': "application/json, text/javascript, */*; q=0.01",
        'cbg-safe-code': CBG_CONFIG.safeCode,
      },
      success: function (data) {
        console.log("addOrder=====>", data);
        var order = data.order
        pwin.gotoPay(order);
      }
    })
  }
})();




; (function () {
  var pwin = window.pwin;
  document.getElementById("payPassword").value = pwin.infoParams.password;
  document.getElementById("activeBtn").click();
})();
