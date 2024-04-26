import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import pinia from '@/stores/index';
import { storeToRefs } from 'pinia';
import { useKeepALiveNames } from '@/stores/keepAliveNames';
import { useRoutesList } from '@/stores/routesList';
import { Local, Session } from '@/utils/storage';
import { staticRoutes, notFoundAndNoPower } from '@/router/route';
import { initBackEndControlRoutes } from '@/router/backEnd';
import { initFrontEndControlRoutes } from "./fontEnd";
import Cookies from 'js-cookie';

/**
 * 1、前端控制路由时：isRequestRoutes 为 false，需要写 roles，需要走 setFilterRoute 方法。
 * 2、后端控制路由时：isRequestRoutes 为 true，不需要写 roles，不需要走 setFilterRoute 方法），
 * 相关方法已拆解到对应的 `backEnd.ts` 与 `frontEnd.ts`（他们互不影响，不需要同时改 2 个文件）。
 * 特别说明：
 * 1、前端控制：路由菜单由前端去写（无菜单管理界面，有角色管理界面），角色管理中有 roles 属性，需返回到 userInfo 中。
 * 2、后端控制：路由菜单由后端返回（有菜单管理界面、有角色管理界面）
 */


/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
export const router = createRouter({
	history: createWebHashHistory(),
	routes: [...notFoundAndNoPower, ...staticRoutes],
});

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组 
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
	if (arr.length <= 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description noCache 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
	if (arr.length <= 0) return false;
	const newArr: any = [];
	const cacheList: Array<string> = [];
	arr.forEach((v: any) => {
		if (v.path === '/') {
			newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] });
		} else {
			if (v.path.indexOf('/:') > -1) {
				v.meta['isDynamic'] = true;
				v.meta['isDynamicPath'] = v.path;
			}
			newArr[0].children.push({ ...v });
			// 存 name 值，keep-alive 中 include 使用，实现路由的缓存
			// 路径：@/layout/routerView/parent.vue
			if (newArr[0].meta.noCache && v.meta.noCache) {
				cacheList.push(v.name);
				const stores = useKeepALiveNames(pinia);
				stores.setCacheKeepAlive(cacheList);
			}
		}
	});
	return newArr;
}

router.beforeEach(async (to) => {
	const whiteArr = ['/login', '/register']
	NProgress.configure({ showSpinner: false });
	if (to.meta.title) NProgress.start();
	const token = Cookies.get('token');
	if (whiteArr.includes(to.path) && !token) {
		NProgress.done();
		return true
	} else {
		if (!token) {
			Session.clear();
			Local.clear();
			Reflect.ownKeys(Cookies.get()).forEach(key => {
				Cookies.remove(key);
			})
			NProgress.done();
			return (`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
		} else if (token && to.path === '/login') {
			NProgress.done();
			return '/staging/interconnection/colorimeter'
		} else {
			const storesRoutesList = useRoutesList(pinia);
			const { routesList } = storeToRefs(storesRoutesList);
			//系统默认后端生成路由，请根据实际需求修改
			if (routesList.value.length == 0) {
				await initFrontEndControlRoutes();
				return { path: to.path, query: to.query };
			} else {
				return true
			}

			if (routesList.value.length == 0) {
				await initBackEndControlRoutes();
				return { path: to.path, query: to.query };
			} else {
				return true
			}
		}
	}
});

// 路由加载后
router.afterEach(() => {
	NProgress.done();
});

// 导出路由
export default router;
