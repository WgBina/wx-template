import http from './http'

const baseUrl = 'https://dht.colourdata.com.cn/hood_smile/'

export default {
    async login(params) {
        return await http.post(`${baseUrl}api/weChatLogin/login`,params) 
    },


    async register(params) {
        return await http.post(`${baseUrl}register`,params) 
    },
}
