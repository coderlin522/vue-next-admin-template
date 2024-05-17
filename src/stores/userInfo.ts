import { defineStore } from 'pinia';
import { Session, Local } from '@/utils/storage';
// import { getUserInfo } from "@/api/login"
/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			username: '',
			avatar: '',
			time: 0,
			roles: [],
			authBtnList: [],
		},
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Local.get('userInfo')) {
				this.userInfos = Local.get('userInfo');
			} else {
				const userInfos = await this.getApiUserInfo() as any;
				this.userInfos = userInfos;
			}
		},
		async getApiUserInfo() {
			// const res = await getUserInfo();
			const userInfos = {
				username: "lin",
				avatar: "",
				time: new Date().getTime(),
				roles: ['common'],
				authBtnList: [],
			};
			Local.set('userInfo', userInfos);
			return userInfos
		},
	},
});
