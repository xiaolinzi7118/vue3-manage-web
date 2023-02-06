import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);

// 全局指令
app.directive('has', {
    beforeMount: function (el, binding) {
        let actionList = storage.getItem('actionList');
        // v-has:add="'user-create'" binding.arg为add binding.value为user-create
        let value = binding.value;
        let hasPermission = actionList.includes(value)
        if (!hasPermission) {
            el.style = 'display:none';
            setTimeout(() => {
                // 挂载之后再删除
                el.parentNode.removeChild(el);
            }, 0)
        }
    }
})

app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;

// 注册全局图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// app.use(router).use(store).use(ElementPlus, { size: 'small' }).mount('#app')
app.use(router).use(store).use(ElementPlus).mount('#app')
