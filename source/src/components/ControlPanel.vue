<template>
    <div class="panel flex">
        <div class="text-align-center align-self-start">
            <h2 class="inline">{{ title }}</h2> <h2 class="bullet inline">•</h2> <h2 class="blue-color inline">{{ subtitle }}</h2>
        </div>
        <p class="text-align-center align-self-end">
            <a href="https://github.com/MarconiGRF/Miniprojeto2-PG" target="_blank" rel="noopener">Código fonte</a>.
        </p>
    </div>
</template>

<script>
export default {
    name: 'ControlPanel',
    props: {
        title: String,
        subtitle: String
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .panel {
        background-color: #f8f9f9;
        height: 54em;
        width: 32em;
    }

    .align-self-start {
        align-self: flex-start;
    }

    .align-self-end {
        align-self: flex-end;
    }

    .bullet {
        font-size: 25px;
    }

    .text-align-center {
        text-align: center;
    }
</style>
