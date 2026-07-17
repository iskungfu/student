import request from './request'

export const getMenus = () => {
  return request({
    url: '/menus',
    method: 'GET'
  })
}

export const createMenu = (data) => {
  return request({
    url: '/menus',
    method: 'POST',
    data
  })
}

export const updateMenu = (id, data) => {
  return request({
    url: `/menus/${id}`,
    method: 'PUT',
    data
  })
}

export const deleteMenu = (id) => {
  return request({
    url: `/menus/${id}`,
    method: 'DELETE'
  })
}
