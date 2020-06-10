import http from './http'

const openId_name = 'xiao_openId'
const sessionKey_name = 'xiao_sessionKey'

const baseUrl = 'https://dht.colourdata.com.cn/hood_smile_test/'

export default {
    async getUserTotal(params) {
        return await http.post(`${baseUrl}api/user/getUserTotal`, params)
    },

    //--------------------------------------- auth ---------------------------------------//
    /**
     * 微信静默登录
     */
    async wxLogin() {
        return new Promise((resolve, reject) => {
            wx.login({
                async success(res) {
                    //默认调用微信登录后就调用后台登录
                    const { success, resCode, data } = await http.post(
                        `${baseUrl}api/weChatLogin/login`,
                        {
                            jsCode: res.code,
                        }
                    )
                    if (success || resCode == -2) {
                        wx.setStorageSync(openId_name, data.openId)
                        wx.setStorageSync(sessionKey_name, data.sessionKey)
                    }

                    return resolve(resCode)
                },
                fail() {
                    wx.showToast({
                        title: '获取code失败',
                        icon: 'none',
                    })
                    return resolve('获取code失败')
                },
            })
        })
    },
    /**
     * 存在用户信息(addUserParams)进行注册
     */
    async register(addUserParams) {
        let query = await formatParams(addUserParams)

        console.log(query)
        return
        http.post(`${baseUrl}register`, query)
    },
}

async function formatParams(params) {
    if (!params) return params

    const { encryptedData } = params
    const { errMsg } = params
    const { iv } = params
    const { rawData } = params
    const { signature } = params
    const { avatarUrl } = params.userInfo
    const { city } = params.userInfo
    const { country } = params.userInfo
    const { gender } = params.userInfo
    const { language } = params.userInfo
    const { province } = params.userInfo
    const wechatName = params.userInfo.nickName

    const openId = wx.getStorageSync(openId_name)
    const sessionKey = wx.getStorageSync(sessionKey_name)

    return {
        encryptedData,
        errMsg,
        iv,
        rawData,
        signature,
        avatarUrl,
        city,
        country,
        gender,
        language,
        province,
        wechatName,
        openId,
        sessionKey,
    }
}
