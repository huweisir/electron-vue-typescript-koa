require("ant-design-vue/dist/antd.css");

// import Radio from 'ant-design-vue/lib/radio';
import Checkbox from 'ant-design-vue/lib/checkbox';
import Layout from "ant-design-vue/lib/layout";
import Menu from "ant-design-vue/lib/menu";

import message from 'ant-design-vue/lib/message';



export default {
    // 普通组件
    components: [
        // Radio,
        Checkbox,
        Layout,
        Menu
    ],
    //原型上的方法
    protos: {
        $message: message,
    }
}
