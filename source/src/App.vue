<template>
    <div id="app">
        <BezierCurves title="Curvas de Bézier"/>
    </div>
</template>

<script>
import BezierCurves from './components/BezierCurves.vue'

export default {
    name: 'MiniProject2',
    components: {
        BezierCurves
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
