import axios from "axios";

axios.defaults.baseURL='http://localhost:3008';//设置默认访问url

export const getTreeList = ()=>{
    return  axios.get('/tree_data')
}