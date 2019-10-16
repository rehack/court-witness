<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data () {
        return {
            theme: this.$store.state.app.themeColor
        };
    },
    mounted () {},
    beforeDestroy () {},
    methods: {}
};
</script>

<style>
html,
body {
  min-width: 1440px;
  height: 100%;
  background: #f0f0f0;
  overflow: auto;
}

.app-main {
  width: 100%;
  height: 100%;
}
.ivu-card{
  /* background-color: #F3FEF8; */
}
</style>
