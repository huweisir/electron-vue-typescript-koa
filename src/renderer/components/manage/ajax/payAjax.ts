import axios from 'axios';
const MD5 = require("../../../../lib/md5.js");
// 通用ajax
const postByJsonAndData = async (req: any, url: string) => {
    var params = {
        // 头部的一些信息
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        Referer: `https://epay.163.com/cashier/m/standardCashier?orderId=${req.orderId}`, //referer
        Host: "my.cbg.163.com",
        Origin: "https://epay.163.com"
    };
    const time = Date.now();
    return await axios({
        url,
        method: "POST", // 默认是 get
        baseURL: req.baseURL || "https://epay.163.com/cashier/m/",
        transformRequest: [
            // form data提交数据时的一种处理，防止405
            (data: any) => {
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
        data: req.data
    });
}

// 选择支付方式
export const ajaxCoupons = async (orderId: number, payAmount: number) => {
    const data = {
        orderId,
        envData: JSON.stringify({ term: "wap" }),
        payMode: JSON.stringify({
            balanceAvailable: true,
            couponAvailable: true,
            quickPayAvailable: true,
            ebankAvailable: true
        }),
        proposal: JSON.stringify({ balance: { payAmount: payAmount } })


    };
    let url = "/ajaxCoupons";
    return await postByJsonAndData({ orderId, payAmount, data }, url)
}

// 付款接口
export const payOrder = async (orderId: number, password: number) => {


    let data = {
        securityValid: JSON.stringify({
            shortPayPassword: MD5(password)
        }),
        orderId,
        envData: JSON.stringify({ term: "wap" })
    }
    let url = "/verifyPayItems";
    let baseURL = "https://epay.163.com/cashier/m/security/"
    return await postByJsonAndData({ orderId, data, baseURL }, url);
}

// 支付接口
export const ajaxPay = async (orderId: number, payAmount: number, yidunToken: string) => {
    let data = {
        proposal: JSON.stringify({ orderId, balance: { payAmount } }),
        securityValid: JSON.stringify({}),
        envData: JSON.stringify({ term: "wap" }),
        yidunToken
    }
    let url = "/ajaxPay";
    return await postByJsonAndData({ orderId, payAmount, yidunToken, data }, url)
}

