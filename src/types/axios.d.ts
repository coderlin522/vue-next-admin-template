/* eslint-disable */
import * as axios from 'axios';

// 扩展 axios 数据返回类型，可自行扩展
declare module 'axios' {
	export interface AxiosResponse<T = any> {
		code: number;
		data: T;
		message: string;
		type?: string;
		[key: string]: T;
	}
}
//写一个全局的IData类型
declare interface IData<T> {
	code: number;
	msg: string;
	data: T;
	img?: string,
	uuid: string,
}