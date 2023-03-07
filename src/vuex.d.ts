// vuex.d.ts
import { Store } from "vuex";

declare module "@vue/runtime-core" {
    // declare your own store states

    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<Any>;
    }
}
