import { XrequestInstance } from '@/utils/request/index';

export const getLoginCode = () => {
	return XrequestInstance.request({
		url: "/captchaImage",
		method: "get",
	})
}
export const userLogin = (data) => {
	return XrequestInstance.request({
		url: "/login",
		method: "post",
		data
	})
}

export const userRegister = (data) => {
  return XrequestInstance.request({
    url: '/register',
    method: 'post',
    data
  })
}

export const getUserRouter = () => {
  return XrequestInstance.request({
		url: "/getRouters",
		method: "get",
  })
}

export const getUserInfo = () => {
	 return XrequestInstance.request({
		url: "/getInfo",
		method: "get",
	 })
}


