require("ant-design-vue/dist/antd.css");

// import Radio from 'ant-design-vue/lib/radio';
import Checkbox from 'ant-design-vue/lib/checkbox';

import message from 'ant-design-vue/lib/message';



export default {
    // 普通组件
    components: [
        // Radio,
        Checkbox
    ],
    //原型上的方法
    protos: {
        $message: message,
    }
}
