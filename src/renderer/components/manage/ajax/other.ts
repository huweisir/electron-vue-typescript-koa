import axios from 'axios';
// 获取订单详情接口
const getByParams = async (req: any, url: string) => {
    return await axios({
        url,
        method: "get", // 默认是 get
        params: req.params
    });
}

// 支付接口
export const getTimestamp = async () => {
    let url = "http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp";
    return await getByParams({}, url)
}