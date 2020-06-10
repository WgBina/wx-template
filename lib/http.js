// url 接口
// params  参数  get key=value  post 对象形式
// ifShowTit 是否隐藏提示有值表示提示
import { register } from '../utils/auth'

const STATUS = 0                       //成功的状态

async function post(url, params = {}, ifShowTit) {
    return new Promise(async (resolve) => {
        let resData = {
            success: false,
            resCode:-100,
            errorMsg: '',
            data: [],
        }
        if (!url) {
            resData.errorMsg = '请输入接口!'
            resolve(resData)
            return
        }
        console.log(url)
        //默认添加openId
        //如果本地不存在openId，则进行获取存储
        // if(!wx.getStorageSync('openId') &&  url.indexOf('login') <0 ){
        //     await register()
        // }

        // params.openId = wx.getStorageSync('openId')

        //默认处理错误状态
        wx.request({
            url,
            data: params,
            method: 'post',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
                if (res.data.code == STATUS) {
                    resData.success = true
                } else {
                    resData.errorMsg = res.data.msg || '服务器出小差了！'
                    resData.data = res.data.data || []
                    if (ifShowTit) {
                        wx.showToast({
                            title: resData.errorMsg,
                            icon: 'none',
                            duration: 2000,
                        })
                    }
                }
                //保存code，登录为-2的时候用到
                resData.data = res.data.data || []
                resData.resCode = res.data.code 

                resolve(resData)
            },
            fail: function (err) {
                resData.errorMsg = '服务器出小差了！'
                if (ifShowTit) {
                    wx.showToast({
                        title: resData.errorMsg,
                        icon: 'none',
                        duration: 2000,
                    })
                }
                resolve(resData)
            },
        })
    })
}

export default {
    post,
}
