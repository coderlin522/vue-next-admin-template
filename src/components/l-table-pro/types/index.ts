import type { FormRules, DatePickType } from "element-plus";
export type ITableColumnConfig = {
  label: string;//表头
  field: string;//字段
  postField?: string;//搜索字段
  hidden?: boolean;//是否隐藏
  editable: boolean; //是否需要编辑
  addable: boolean; //是否可添加
  overflowTip: boolean; //是否超出显示提示
  type: "input" | "select" | "img" | "upload" | "time" | "switch";
  timeType?: DatePickType;
  slot?: string; //插槽
  searchType?: "input" | "select";
  searchSelectOptions?: { label: string, value: string | number, id?: number | string }[]; //搜索的下拉选项 
  selectValueType?: "object" | "key"; //下拉绑定值类型
  multiplable?: boolean; //多选
  selectLoading?: boolean; //下拉加载状态
  initOptionFn?: (...args: any[]) => any; //下拉选项初始化函数
  span?: number;//col的宽度
  align?: "left" | "center" | "right"; //对齐方式
}

export type ITableConfig = {
  border?: boolean,//是否显示边框
  multiple: boolean; //多选
  tableActionColumn: boolean; //是否显示表格操作列
  tableActionFixed?: 'left' | 'right' | boolean;
  editRules: FormRules; //编辑rules
  addRules: FormRules; //新增rules
  addBtnText?: string;
  viewBtn?: boolean;
  addBtn?: boolean;
  editBtn?: boolean;
  deleteBtn?: boolean;
  multipleDeleteBtn?: boolean;  //批量删除
  leftMenuAuth?: IAuth;   //左侧菜单权限
}

export type IRole = 'manage' | 'clinic' | 'mechanic' | 'mechanic_manager'
export type IAuth = IRole[]
