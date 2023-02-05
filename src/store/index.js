/**
 * Vuex状态管理
 */
import { createStore } from 'vuex'
import mutations from './mutations'
import storage from './../utils/storage'

const state = {
    userInfo: storage.getItem("userInfo") || {}, // 获取用户信息
    menuList: storage.getItem("menuList"), // 权限菜单
    actionList: storage.getItem("actionList") // 权限按钮
}
export default createStore({
    state,
    mutations
})