<template>
    <div class="unit flex column align-items-center" @click="action">
        <img v-bind:src="getIcon(icon.name, icon.size, icon.type)"/>
        <p>{{ text }}</p>
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
    max-width: 4em;
}

img {
    height: 30px;
    width: 30px;
    margin: .3em;
}

p {
    margin: 0;
    font-size: 12px;
}
</style>
