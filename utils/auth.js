
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
    checkAndAuthorize: checkAndAuthorize,
}
