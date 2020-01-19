<template>
    <div id="Main">
        <router-view/>
    </div>

</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'

    export default {
        name: "Main",
        data() {
            return {}
        },
        methods: {},
        computed: {},
        created() {
        }
    }
</script>

<style scoped lang="scss">
</style>
