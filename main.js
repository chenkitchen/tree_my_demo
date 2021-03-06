import Vue from 'vue';
import app from './app.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

export default new Vue({
    el:'#app',
    render:h=>h(app)
})