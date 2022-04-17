<template>
  <div>
      <!-- v-if="data.length"避免重复渲染 -->
    <el-tree 
    :data="data" 
    v-if="data.length"
    :default-expand-all='true'
    :render-content="render"
    ></el-tree>
    <!-- <span class='el-icon-folder'></span>
            <span class='el-icon-folder-opened'></span>
            <span class='el-icon-document'></span> -->
  </div>
</template>

<script>
import _ from "lodash";
export default {
  // props:['allData'],
  props: {
    allData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      data: [],
    };
  },
  watch: {//监控数据变化就更新视图
    allData() {
        this.transData();
    },
    // {
    //             data.type? <span class='el-icon-folder'> : <span class='el-icon-document'></span>
    //         }
  },
  methods: {
    isParent(data){
        return data.type == 'parent1'
    },
    render(h, { node, data }){
        console.log(node, data.type);
        return (<div>
        {this.isParent(data)? node.expanded? <span class='el-icon-folder-opened'></span>:<span class='el-icon-folder'></span>:<span class='el-icon-document'></span>}
        
        {data.name} 
        
        </div>)
    },
    transData() {
      let otherData = _.cloneDeep(this.allData);
      console.log(otherData);
      //数据映射
      //{id:1,{name: '文件夹1', pid: 0, id: 1}}
      let treeMap = otherData.reduce((newEle, ele) => {
        //所以数据要进行克隆一份
        ele.label = ele.name;
        newEle[ele["id"]] = ele;
        return newEle;
      }, []); //reduce的结果就是个对象
      console.log(treeMap);
      let treeData = treeMap.reduce((arr, current) => {
        let pid = current.pid;
        let parent = treeMap[pid];
        if (parent) {
          parent.children
            ? parent.children.push(current)
            : (parent.children = [current]);
        } else if (pid === 0) {
          arr.push(current);
        }
        return arr;
      }, []);
      console.log(treeData);
      //vue 中的vuex源码就是这样
      //reduce减少循环递归次数
      this.data = treeData;
    },
  },
  mounted() {},
};
</script>

<style  scoped>
</style>