declare type IRecord<T> = {
	records: T[];
	total: number;
	size: number;
	current: number;
}

declare type IUserItem = {
	userId: number;
	dentalOfficeId: number;
	status: number;
	administratorName: string;
	idCard?: any;
	idPositive: string;
	idNegative: string;
	userName: string;
	phone: string;
	businessLicence: string;
	clinicOutdoors?: any;
	address: string;
	dentalOfficeName: string;
	deviceNo: string;
	switchloading?: boolean
}
declare type IPatient = {
	id: number;
	name: string;
	certificatesType: string;
	certificatesNo: string;
	sex: number;
	birthDate: string;
	phone: string;
	isMarry: number;
	provinceCode: string;
	cityCode: string;
	districtCode: string;
	address: string;
	status: number;
	createdTime: string;
	updatedTime: string;
	isDeleted: number;
}

declare type IColorItem = {
	id: number;
	firstStageCode: string;
	secondStageCode: string;
	thirdStageCode: string;
	red: number;
	green: number;
	blue: number;
	createdTime: string;
	updatedTime: string;
	sort: number;
	delFlag: string;
	dentalOfficeId?: any;
	deviceNo?: any;
}
declare type IDeviceItem = {
	imageViewerVisible: boolean;
	id: number;
	deviceNo: string;
	typeName: string;
	versionName: string;
	qrCode: string;
	createTime: string;
	pages: number;
}

declare type IDeviceTypeItem = {
	id: number;
	typeName: string;
	sort: number;
	delFlag: string;
	createBy: string;
	createTime: string;
	updateTime: string;
	updateBy: string;
	remark: string;
}

declare type IDeviceVersionItem = {
	id: number;
	versionName: string;
	sort: number;
	delFlag: string;
	createBy: string;
	createTime: string;
	updateBy: string;
	updateTime: string;
	remark: string;
	versionCode: string;
}