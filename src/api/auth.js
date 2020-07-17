import request from '@/utils/request'


function login(data) {
    return request({
        url: '/auth/login',
        method: 'post',
        data
    })
}

function loginOut(data) {
    return request({
        url: '/auth/loginOut',
        method: 'post',
        data
    })
} 

export default {
    login,
    loginOut,
}



