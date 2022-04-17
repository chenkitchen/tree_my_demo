<template>
    <div>

    </div>
</template>

<script>
import {getTreeList} from './api'
    export default {
        async mounted(){
            let {data} = await getTreeList()
            // console.log(data);
            //1\扁平化的数据如何变成 多层数据 递归数据
            let allData = [...data.parent,...data.child];
            // console.log(allData);
            //数据映射
            //{id:1,{name: '文件夹1', pid: 0, id: 1}}
            let treeMap = allData.reduce((newEle,ele)=>{
                newEle[ele['id']]=ele;
                return newEle
            },[])//reduce的结果就是个对象
            console.log(treeMap);
            let treeData = treeMap.reduce((arr,current)=>{
                let pid = current.pid;
                let parent = treeMap[pid];
                if(parent){
                    parent.children? parent.children.push(current):parent.children = [current]
                }else if(pid === 0){
                    arr.push(current);
                }
                return arr
            },[])
            console.log(treeData);
        }
    }
</script>

<style  scoped>

</style>