<template>
    <div>
        <MyTree :allData.sync='data' :fileDrop="fileDrop" :diectoryDrop="diectoryDrop" />
    </div>
</template>

<script>
import MyTree from './MyTree.vue'
import {getTreeList} from './api'
    export default {
        data(){
            return {
                data:[],
                fileDrop:[
                    {text:'rn',value:'修改名字'},
                    {text:'rm',value:'删除文件'}
                ],
                diectoryDrop:[
                    {text:'rn',value:'修改名字'},
                    {text:'rm',value:'删除文件夹'}
                ]
            }
        },
        components:{
            MyTree
        },
        async mounted(){
            let {data} = await getTreeList()
            // console.log(data);
            //添加parent来区分是文件还是文件夹
            // data.parent.forEach(p=>p.type == 'parent1') 
            // console.log(data);
            data.parent.map(p=>{
                // console.log(p);
                p.type = 'parent1'
            })

            //1\扁平化的数据如何变成 多层数据 递归数据
            let allData = [...data.parent,...data.child];
            // console.log(allData);
            this.data = allData;
            

        }
    }
</script>

<style  scoped>

</style>