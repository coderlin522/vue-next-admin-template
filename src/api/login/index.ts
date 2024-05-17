import { XrequestInstance } from '@/utils/request/index';

export const userLogin = (data) => {
	return XrequestInstance.request({
		url: "/login",
		method: "post",
		data
	})
}


