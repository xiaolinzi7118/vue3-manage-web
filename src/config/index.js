/**
 * 环境变量配置
 */
const env = import.meta.env.MODE || 'prod';
const EnvConfig = {
    //.env.dev 文件dev重命名为development
    development: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/2b6d7acc62fddc27a5bb96138fbd0d91/api'
    },
    test: {
        baseApi: '//test.linzi.com/api',
        mockApi: 'https://www.fastmock.site/mock/2b6d7acc62fddc27a5bb96138fbd0d91/api'
    },
    prod: {
        baseApi: '//linzi.com/api',
        mockApi: 'https://www.fastmock.site/mock/2b6d7acc62fddc27a5bb96138fbd0d91/api'
    }
}
export default {
    env,
    mock: false,
    namespace: 'manager',
    ...EnvConfig[env]
}