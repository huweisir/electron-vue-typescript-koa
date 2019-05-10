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
        params: req.params || ""
    });
}


export const get_order_pay_info = async (orderid_to_epay: string, ifmsrc: string, safeCode: string) => {
    let ajaxurl = "/get_order_pay_info";
    let headers = {
        my_info: JSON.stringify({
            Host: "dl.reg.163.com",
            Referer: "https://dl.reg.163.com/webzj/v1.0.1/pub/index2_new.html?cd=https%3A%2F%2Fcbg-my.res.netease.com%2Frcc1cf3df895aee8e4f4b6&cf=%2Fcss%2Furs-login-with-phone.css&MGID=1557315528181.2114&wdaId=&pkid=aqpOBwV&product=cbg"
        })
    }
    let params = {
        orderid_to_epay,
        headers,
        view_loc: "all_list"
    }
    return await getByParams({ params, ifmsrc, safeCode }, ajaxurl);

}


export const my_orders = async (ifmsrc: string, safeCode: string) => {
    let url = "/my_orders?page=1&status=1";
    return await postByParams({ ifmsrc, safeCode }, url)
}