import api from '../lib/api'
async function checkSession() {
    return new Promise((resolve, reject) => {
        wx.checkSession({
            success() {
                return resolve(true)
            },
            fail() {
                return resolve(false)
            },
        })
    })
}

async function wxLogin() {
    return new Promise((resolve, reject) => {
        wx.login({
            success(res) {
                return resolve(res.code)
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
async function register(
    loginParams = {},
    addUserParams ,
    loginType = ''
) {
    wxLogin().then((res) => {
      console.log(res)
        let query = {
            jsCode: res,
            ...loginParams,
        }
        api.login(query).then((res) => {
            console.log(res)
            const { openId } = res.data
            const { sessionKey } = res.data
            wx.setStorageSync('xiao_openId', openId)
            wx.setStorageSync('xiao_sessionKey', sessionKey)

            //已授权解锁以下板块
            if (!addUserParams) return

            let query = formatParams(addUserParams)
            if (query) {
                query.openId = openId
                query.sessionKey = sessionKey
            }
            console.log('注册参数:', query)
            //code == -2, 用户不存在，进行注册
            if (res.code == -2) {
                //注册用户
                addUser(query)
            }
        })
    })
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
