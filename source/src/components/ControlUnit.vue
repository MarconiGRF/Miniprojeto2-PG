<template>
    <div class="unit flex column align-items-center" v-on:click="action">
        <img :src="getIcon(icon.name, icon.size, icon.type)"/>
        <p class="small-text">{{ text }}</p>
    </div>
</template>

<script>
export default {
    name: "ControlUnit",
    methods: {
        getIcon(name, size, type) {
            let icon = require('../assets/fluent-icons/ic_fluent_' + name + '_' + size + '_' + type + '.svg');
            return icon;
        }
    },
    props: {
        action: { Type: Function },
        icon: Object,
        text: String
    }
}
</script>

<style scoped>
.unit {
    max-height: 4em;
    width: 4em;
    margin: .3em 1em 0 0;
}

img {
    height: 30px;
    width: 30px;
    margin: .3em;
}

p {
    margin: 0;
}
</style>
