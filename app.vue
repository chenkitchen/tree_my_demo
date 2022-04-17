<template>
    <div>

    </div>
</template>

<script>
import {getTreeList} from './api'
    export default {
        async mounted(){
            let res= await getTreeList()
            console.log(res);
        }
    }
</script>

<style  scoped>

</style>