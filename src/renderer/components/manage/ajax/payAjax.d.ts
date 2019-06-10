export declare const ajaxCoupons: (orderId: number, payAmount: number) => Promise<import("axios").AxiosResponse<any>>;
export declare const payOrder: (orderId: number, password: number) => Promise<import("axios").AxiosResponse<any>>;
export declare const ajaxPay: (orderId: number, payAmount: number, yidunToken: string) => Promise<import("axios").AxiosResponse<any>>;
