// 获取订单详情接口
import axios from 'axios';
const getByParams = async (req: any, url: string) => {
    return await axios({
        url,
        method: "get", // 默认是 get
        baseURL: req.baseURL || "https://my.cbg.163.com/cgi/api/",
        headers: req.headers || {
            "cbg-safe-code": req.safeCode,
            my_info: JSON.stringify({
                Referer: req.ifmsrc, //referer
                Host: "my.cbg.163.com",
                Origin: "https://my.cbg.163.com"
            })
        },
        params: req.params
    });
}
const postByParams = async (req: any, url: string) => {
    return await axios({
        url,
        method: "post", // 默认是 get
        baseURL: "https://my.cbg.163.com/cgi/api/",
        headers: req.headers || {
            "cbg-safe-code": req.safeCode,
            my_info: JSON.stringify({
                Referer: req.ifmsrc, //referer
                Host: "my.cbg.163.com",
                Origin: "https://my.cbg.163.com"
            })
        },
        params: req.params
    });
}


export const get_order_pay_info = async (orderid_to_epay: string, ifmsrc: string, safeCode: string) => {
    let ajaxurl = "/get_order_pay_info";
    let params = {
        orderid_to_epay,
        view_loc: "all_list"
    }
    let res = await getByParams({ params, ifmsrc, safeCode }, ajaxurl);
    let data = res.data || {};
    // 拿到支付URL
    let url =
        data.pay_info && data.pay_info.epay_pay_url
            ? data.pay_info.epay_pay_url
            : "";
    return url;
}

//获取商品详情接口
export const get_equip_detail = async (ordersn: string, ifmsrc: string, serverid: number, safeCode: string) => {
    let params = {
        serverid: serverid,
        ordersn: ordersn,
        view_loc: "all_list"
    }
    let ajaxurl = "/get_equip_detail";
    let res = await getByParams({ params, ifmsrc, safeCode }, ajaxurl);
    let back;
    let resData = res.data || {};
    if (resData && resData.equip) {
        back = resData.equip;
    }
    return back;
}

//生成订单
export const add_order = async (equip: any, serverid: number, ordersn: string, ifmsrc: string, safeCode: string) => {
    let params = {
        serverid: serverid,
        confirm_price_total: equip.price,
        ordersn: ordersn,
        view_loc: "all_list"
    }
    let url = "/add_order";
    return await postByParams({ params, ifmsrc, safeCode }, url)
}

// 取消订单
export const cancel_order = async (orderid_to_epay: string, ifmsrc: string, safeCode: string) => {
    let params = {
        orderid_to_epay
    }
    let url = "/cancel_order";
    return await postByParams({ params, ifmsrc, safeCode }, url)
}