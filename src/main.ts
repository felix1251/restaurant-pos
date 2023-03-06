import { createApp } from "vue";
import store from "./store";
import App from "./App.vue";
import "./style.css";

createApp(App)
    .use(store)
    .mount("#app")
    .$nextTick(() => {
        postMessage({ payload: "removeLoading" }, "*");
    });
