/* *********** vue 外部引入的插件 ************ */
import antds from './antd';
// import VueAwesomeSwiper from './swiper';
// import utils from './utils';

export const use = [
    // ...utils,
    ...antds.components,
    // VueAwesomeSwiper
]

export const protos = {
    ...antds.protos
}