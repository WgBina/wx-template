import api from '../lib/api'
const openId_name = 'xiao_openId'
const sessionKey_name = 'xiao_sessionKey'

/**
 * 微信静默登录
 */
async function wxLogin() {
    return new Promise((resolve, reject) => {
        wx.login({
            async success(res) {
                //默认调用微信登录后就调用后台登录
                const { success, resCode, data } = await api.login({
                    jsCode: res.code,
                })
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
}

/**
 * 后台有条件注册
 */
async function register(addUserParams) {
    let query = await formatParams(addUserParams)

    console.log(query)
    return
    api.register(query)
}

async function getUserInfo() {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            success: (res) => {
                return resolve(res)
            },
            fail: (err) => {
                console.error(err)
                return resolve()
            },
        })
    })
}

/**
 *
 * login
 * @param {jsCode}
 *
 * 存在用户信息(addUserParams) && login的code返回-2才进行注册
 * addUser
 * @param {--userId--userLevel}
 */

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

function loginOut() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('uid')
}

async function checkAndAuthorize(scope) {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success(res) {
                if (!res.authSetting[scope]) {
                    wx.authorize({
                        scope: scope,
                        success() {
                            resolve() // 无返回参数
                        },
                        fail(e) {
                            console.error(e)
                            // if (e.errMsg.indexof('auth deny') != -1) {
                            //   wx.showToast({
                            //     title: e.errMsg,
                            //     icon: 'none'
                            //   })
                            // }
                            wx.showModal({
                                title: '无权操作',
                                content: '需要获得您的授权',
                                showCancel: false,
                                confirmText: '立即授权',
                                confirmColor: '#e64340',
                                success(res) {
                                    wx.openSetting()
                                },
                                fail(e) {
                                    console.error(e)
                                    reject(e)
                                },
                            })
                        },
                    })
                } else {
                    resolve() // 无返回参数
                }
            },
            fail(e) {
                console.error(e)
                reject(e)
            },
        })
    })
}

module.exports = {
    getUserInfo: getUserInfo,
    wxLogin: wxLogin,
    register: register,
    loginOut: loginOut,
    checkAndAuthorize: checkAndAuthorize,
}
