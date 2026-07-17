import request from './request'

export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

export const getProfile = () => {
  return request({
    url: '/auth/profile',
    method: 'GET'
  })
}
