<template>
    <div id="app">
        <ControlPanel title="Miniprojeto 2" subtitle="Curvas de Bézier"/>
    </div>
</template>

<script>
import ControlPanel from './components/ControlPanel.vue'

export default {
    name: 'MiniProject2',
    components: {
        ControlPanel
    }
}
</script>

<style>
body {
    font-family: 'DM Sans', sans-serif;
    color: var(--sl-color-gray-30);
    margin: 0;
}

h1,  p {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
}

.header h1 {
    font-size: 3em;
}

.header .title {
    margin-top: 0.25em;
    margin-bottom: 0.25em;
}

.header .subtitle {
    font-size: 1.5em;
    text-transform: uppercase;
    font-weight: 700;
}

.gray-color {
    color: var(--sl-color-gray-30);
}

.blue-color {
    color: var(--sl-color-primary-45);
}

.float-left {
    float: left;
}

.float-right {
    float: right;
}

.inline {
    display: inline;
}

.flex {
    display: flex;
}

.column {
    flex-direction: column;
}

.align-items-center {
    align-items: center;
}

.full-width {
    width: 100%;
}
</style>
