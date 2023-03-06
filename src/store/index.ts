import { createStore } from "vuex";
import renderer from "./renderer";

export default createStore({
    state: {
        isLogin: true,
    },
    mutations: {
        setUser(state) {
            state.isLogin = true;
        },
        unsetUser(state) {
            state.isLogin = false;
        },
    },
    actions: {},
    getters: {},
    plugins: [renderer],
});
