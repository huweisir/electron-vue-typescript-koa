export declare const get_order_pay_info: (orderid_to_epay: string, ifmsrc: string, safeCode: string) => Promise<any>;
export declare const get_equip_detail: (ordersn: string, ifmsrc: string, serverid: number, safeCode: string) => Promise<any>;
export declare const add_order: (equip: any, serverid: number, ordersn: string, ifmsrc: string, safeCode: string) => Promise<import("axios").AxiosResponse<any>>;
export declare const cancel_order: (orderid_to_epay: string, ifmsrc: string, safeCode: string) => Promise<import("axios").AxiosResponse<any>>;
export declare const my_orders: (ifmsrc: string, safeCode: string) => Promise<import("axios").AxiosResponse<any>>;
