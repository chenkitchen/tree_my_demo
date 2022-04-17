<template>
  <div>
    <!-- v-if="data.length"避免重复渲染 -->
    <el-tree
      :data="data"
      v-if="data.length"
      :default-expand-all="true"
      :render-content="render"
      :expand-on-click-node="false"
    ></el-tree>
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
    diectoryDrop: Array,
    fileDrop: Array,
  },
  data() {
    return {
      data: [],
      currentId: "",
      currentName: "",
    };
  },
  watch: {
    //监控数据变化就更新视图
    allData() {
      this.transData();
    },
  },
  methods: {
    handleInput(data){
      console.log(data);
      this.currentName = data;
    },
    clearTree(){
      this.currentId ='';
      this.currentName = '';
    },
    confirmTree(data){
      console.log(data);
      let newData = _.cloneDeep(this.allData);
      console.log(newData);
      let afterData = newData.find((item) => item.id === data.id);
      afterData.name = this.currentName;
      console.log(afterData);
      // newData.map(item=>{
      //   if(item.id == data.id){
      //     item.name = this.currentName;
      //   }
      // })
      this.$emit("update:allData", newData);
      this.$message({
        type: "success",
        message: "修改成功!",
      });
      this.clearTree();
    },
    handleDelet(data) {
      this.open(data);
      console.log(data);
    },
    handleRename(data) {
      console.log(data);
      this.currentId = data.id;
      this.currentName = data.name;
    },
    handleCommand(data, text) {
      console.log(data, text);
      if (text == "rn") {
        this.handleRename(data);
      } else if (text == "rm") {
        this.handleDelet(data);
      }
    },
    isParent(data) {
      return data.type == "parent1";
    },
    render(h, { node, data }) {
      // console.log(node, data.type);
      let list = this.isParent(data) ? this.diectoryDrop : this.fileDrop;
      // console.log(list);
      return (
        <div>
          {this.isParent(data) ? (
            node.expanded && node.childNodes.length != 0 ? (
              <span class="el-icon-folder-opened"></span>
            ) : (
              <span class="el-icon-folder"></span>
            )
          ) : (
            <span class="el-icon-document"></span>
          )}
          {data.id === this.currentId ? (
            <el-input value={this.currentName} on-input={this.handleInput}></el-input>
          ) : (
            data.name
          )}

          {/** bind 绑定时会把原来的参数向后移动**/}
          {data.id === this.currentId ? (<span style="color:skyblue;"><el-button on-click={this.confirmTree.bind(this,data)}>确定</el-button>   <el-button on-click={this.clearTree}>取消</el-button></span>) : (
            <el-dropdown
              placement="bottom-start"
              trigger="click"
              on-command={this.handleCommand.bind(this, data)}
            >
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                {list.map((item) => (
                  <el-dropdown-item command={item.text}>
                    {item.value}
                  </el-dropdown-item>
                ))}
              </el-dropdown-menu>
            </el-dropdown>
          )}
        </div>
        //()包html，{}包script
      );
    },
    transData() {
      let otherData = _.cloneDeep(this.allData);
      // console.log(otherData);
      //数据映射
      //{id:1,{name: '文件夹1', pid: 0, id: 1}}
      let treeMap = otherData.reduce((newEle, ele) => {
        //所以数据要进行克隆一份
        ele.label = ele.name;
        newEle[ele["id"]] = ele;
        return newEle;
      }, []); //reduce的结果就是个对象
      // console.log(treeMap);
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
      // console.log(treeData);
      //vue 中的vuex源码就是这样
      //reduce减少循环递归次数
      this.data = treeData;
    },
    open(data) {
      this.$confirm(`'${data.name}'是否删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //
          this.deleteTree(data.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    deleteTree(id) {
      let newData = _.cloneDeep(this.allData);
      let afterData = newData.filter((item) => item.id != id);
      console.log(afterData);
      this.$emit("update:allData", afterData);
      this.$message({
        type: "success",
        message: "删除成功!",
      });
    },
  },
  mounted() {},
};
</script>

<style >
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
} 
.el-dropdown-menu .el-popper {
  left: 135px;
}
.el-tree{
  margin-top: 30px;
}
.el-tree .el-tree-node__content{
  height: 40px;
}
</style>