declare const _default: {
    state: {
        iframeSrc: string;
        safeCode: string;
    };
    mutations: {
        UPDATE_IFRAME_SRC(state: any, value: string): void;
        UPDATE_SAFE_CODE(state: any, value: string): void;
    };
    actions: {
        updateIframeSrc({ commit }: any, iframeSrc: string): void;
        updateSafeCode({ commit }: any, safeCode: string): void;
    };
};
export default _default;
