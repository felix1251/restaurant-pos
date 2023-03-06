import { ipcRenderer } from "electron";

export default (store: any) => {
    ipcRenderer.send("isLogin", "initial", store.state.isLogin);

    store.subscribe((mutation: any, state: any) => {
        const { type } = mutation;
        switch (type) {
            case "setUser":
            case "unsetUser":
                ipcRenderer.send("isLogin", "onset", state.isLogin);
                break;
            default:
                break;
        }
    });
};
