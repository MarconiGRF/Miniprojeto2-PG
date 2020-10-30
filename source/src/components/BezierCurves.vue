<template>
    <div class="hello">
        <h1>{{ title }}</h1>
        <p>
            <a href="https://github.com/MarconiGRF/Miniprojeto2-PG" target="_blank" rel="noopener">Código fonte</a>.
        </p>
    </div>
</template>

<script>
export default {
    name: 'BezierCurves',
    props: {
        title: String
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
