/**
 * api管理
 */
import request from './../utils/request'
export default {
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
        })
    },
    noticeCount() {
        return request({
            url: '/leave/count',
            method: 'get',
            data: {},
        })
    },
    menuList() {
        return request({
            url: '/menu/list',
            method: 'get',
            data: {},
        })
    },
    userList(params) {
        return request({
            url: '/users/list',
            method: 'get',
            data: params,
        })
    },
    userDelete(params) {
        return request({
            url: '/users/delete',
            method: 'post',
            data: params,
        })
    },
    roleList() {
        return request({
            url: '/roles/allList',
            method: 'get',
            data: {},
        })
    },
    deptList() {
        return request({
            url: '/dept/list',
            method: 'get',
            data: {},
        })
    },
    userSubmit(params) {
        return request({
            url: '/users/operate',
            method: 'post',
            data: params,
        })
    }
}