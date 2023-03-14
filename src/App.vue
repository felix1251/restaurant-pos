<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";

console.log(
    "[App.vue]",
    `Hello world from Electron ${process.versions.electron}!`
);
</script>

<template>
    <div>
        <a
            href="https://www.electronjs.org/"
            target="_blank"
        >
            <img
                src="./assets/electron.svg"
                class="logo electron"
                alt="Electron logo"
            />
        </a>
        <a
            href="https://vitejs.dev/"
            target="_blank"
        >
            <img
                src="/vite.svg"
                class="logo"
                alt="Vite logo"
            />
        </a>
        <a
            href="https://vuejs.org/"
            target="_blank"
        >
            <img
                src="./assets/vue.svg"
                class="logo vue"
                alt="Vue logo"
            />
        </a>
    </div>
    <div class="h-5 w-10 bg-gray-700">felix</div>
    <HelloWorld msg="Electron + Vite + Vue" />
    <div class="flex-center">
        Place static files into the <code>/public</code> folder
        <img
            style="width: 5em"
            src="/node.svg"
            alt="Node logo"
        />
    </div>
</template>
