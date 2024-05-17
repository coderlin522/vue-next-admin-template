<template>
	<div class="l-table-pro">
		<div class="search-criteria" v-if="!isHidden">
			<el-form ref="searchForm">
				<el-row :gutter="20" style="margin: 0 !important">
					<template v-if="!slots.search">
						<template v-for="config in tableColumnConfig" :key="config.field">
							<el-col :span="config.span ?? 6" v-if="config.searchType">
								<el-form-item :label="config.label">
									<template v-if="config.searchType == 'input'">
										<el-input v-model="searchFormProxy[`${config.field}`]" :placeholder="`请输入${config.label}`" />
									</template>
									<template v-if="config.searchType == 'select'">
										<el-select
											v-model="searchFormProxy[config.postField ? `${config.postField}` : `${config.field}`]"
											:loading="config.selectLoading"
											:placeholder="`请选择${config.label}`"
										>
											<el-option
												v-for="item in config.searchSelectOptions"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											/>
											<template #loading>
												<el-icon class="is-loading">
													<svg class="circular" viewBox="0 0 20 20">
														<g class="path2 loading-path" stroke-width="0" style="animation: none; stroke: none">
															<circle r="3.375" class="dot1" rx="0" ry="0" />
															<circle r="3.375" class="dot2" rx="0" ry="0" />
															<circle r="3.375" class="dot4" rx="0" ry="0" />
															<circle r="3.375" class="dot3" rx="0" ry="0" />
														</g>
													</svg>
												</el-icon>
											</template>
										</el-select>
									</template>
								</el-form-item>
							</el-col>
						</template>
					</template>
					<template v-else>
						<slot name="search"> </slot>
					</template>
				</el-row>
			</el-form>
			<div class="search-btn" v-if="searchLength || slots.search">
				<div class="btn-wrapper" v-if="!isHidden">
					<el-button type="primary" @click="handleSearch">搜索</el-button>
					<el-button type="primary" @click="handleReset">重置</el-button>
				</div>
			</div>
		</div>
		<!-- <div class="flex justify-center" @click="isHidden = !isHidden">
			<el-icon size="20">
				<component :is="isHidden ? 'ele-ArrowDown' : 'ele-ArrowUp'"></component>
			</el-icon>
		</div> -->
		<div class="action">
			<div class="flex" v-auth="tableConfig.leftMenuAuth">
				<el-button v-if="tableConfig.addBtn" type="primary" @click="addDialogRef!.dialogVisible = true">
					{{ tableConfig['addBtnText'] }}
				</el-button>
				<el-button v-if="tableConfig.multipleDeleteBtn" type="danger" @click="handleMultipleTableDelete">
					批量删除
				</el-button>
			</div>
			<div class="menuLeftSlot">
				<slot name="menuLeft"></slot>
			</div>
		</div>
		<el-table
			:data="tableList"
			v-loading="loading"
			@selection-change="handleSelectionChange"
			:border="tableConfig.border"
		>
			<el-table-column type="selection" width="55" v-if="tableConfig.multiple" />
			<template v-for="config in tableColumnConfig" :key="config.field">
				<el-table-column
					v-if="!config.hidden"
					:show-overflow-tooltip="config.overflowTip"
					:prop="config.field"
					:label="config.label"
					:align="config.align"
				>
					<template #default="{ row }" v-if="config.slot">
						<slot :name="config.slot" :row="row"></slot>
					</template>
				</el-table-column>
			</template>

			<el-table-column
				label="操作"
				v-if="tableConfig.tableActionColumn"
				:fixed="tableConfig.tableActionFixed"
			>
				<template #default="{ row }">
					<template v-if="slots.action">
						<slot name="action" :row="row"></slot>
					</template>
					<template v-else>
						<template v-if="tableConfig.viewBtn">
							<el-button size="small" @click="handleTableView(row)"> 详情 </el-button>
						</template>
						<template v-if="tableConfig.editBtn">
							<el-button size="small" type="warning" @click="handleTableEdit(row)"> 编辑 </el-button>
						</template>
						<template v-if="tableConfig.deleteBtn">
							<el-popconfirm title="您确认要删除这条数据吗" @confirm="handleTableDelete(row)">
								<template #reference>
									<el-button size="small" type="danger"> 删除 </el-button>
								</template>
							</el-popconfirm>
						</template>
					</template>
				</template>
			</el-table-column>
			<template #empty>
				<el-empty></el-empty>
			</template>
		</el-table>
		<div class="pagination">
			<el-pagination
				hide-on-single-page
				v-model:current-page="currentPage"
				v-model:page-size="currentSize"
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="[10, 20, 50, 100]"
				:total="total"
			/>
		</div>

		<l-add
			:addRules="tableConfig.addRules"
			@beforeAdddialogOpen="beforeAdddialogOpen"
			:tableColumnConfig="tableColumnConfig"
			@add-action-click="handleDialogAdd"
			ref="addDialogRef"
		/>
		<l-edit
			:edit-rules="tableConfig.editRules"
			:table-column-config="tableColumnConfig"
			@beforeEditDrawerOpen="beforeEditDrawerOpen"
			@edit-action-click="handleDialogEdit"
			ref="editFormRef"
		/>
	</div>
</template>
<script lang="ts" setup>
import type { ITableColumnConfig, ITableConfig } from './types';
import lAdd from './crud-dialog/add.vue';
import lEdit from './crud-dialog/edit.vue';
import useVModelProps from '@/hooks/useVModelProps';
const props = withDefaults(
	defineProps<{
		tableList: any[];
		tableColumnConfig: ITableColumnConfig[];
		tableConfig: ITableConfig;
		loading: boolean;
		pagination: {
			currentPage: number;
			pageSize: number;
		};
		total: number;
		searchForm: Record<string, any>;
	}>(),
	{
		tableList: () => [],
	}
);
const isHidden = ref(false);
const slots = useSlots();
const searchLength = computed(() => props.tableColumnConfig.filter((item) => item.searchType).length > 0);

Promise.all(
	props.tableColumnConfig.filter((v) => v.initOptionFn != undefined).map((v) => v.initOptionFn && v.initOptionFn(v))
);

// const emits = defineEmits<{
// 	addActionClick: [form: any];
// 	handleSearch: [searchForm: Record<string, any>];
// 	handleReset;
// 	'update:pagination';
// 	'update:searchForm';
// 	beforeEditDrawerOpen: [
// 		{
// 			row: any;
// 			openLoading: () => void;
// 			closeLoading: () => void;
// 			setOption: (key: string, value: any) => void;
// 			setForm: (key: string, value: any) => void;
// 		}
// 	];
// 	beforeAdddialogOpen;
// 	viewActionClick;
// 	deleteActionClick;
// 	editActionClick: [{ row: any; done: () => void }];
// 	handleSizeChange;
// 	handleCurrentChange;
// }>();

const emits = defineEmits<{
	(e: 'addActionClick', args: { form: any; done: () => void }): void;
	(e: 'handleSearch', searchForm: Record<string, any>): void;
	(e: 'handleReset'): void;
	(e: 'update:pagination', pagination: { currentPage: number; pageSize: number }): void;
	(e: 'update:searchForm', searchForm: Record<string, any>): void;
	(
		e: 'beforeEditDrawerOpen',
		args: {
			row: any;
			openLoading: () => void;
			closeLoading: () => void;
			setOption: (key: string, value: any) => void;
			setForm: (key: string, value: any) => void;
		}
	): void;
	(
		e: 'beforeAdddialogOpen',
		args: { openLoading: () => void; closeLoading: () => void; setOption: (key: string, value: any) => void }
	): void;
	(e: 'viewActionClick', row: any): void;
	(e: 'deleteActionClick', row: any): void;
	(e: 'multipleDeleteClick', arr: any[]);
	(e: 'editActionClick', args: { row: any; done: () => void }): void;
}>();

const searchFormProxy = useVModelProps(props, 'searchForm', emits);
const addDialogRef = ref<InstanceType<typeof lAdd>>();
const editFormRef = ref<InstanceType<typeof lEdit>>();

const currentPage = computed({
	get() {
		return props?.pagination?.currentPage;
	},
	set(value) {
		emits('update:pagination', { ...props.pagination, currentPage: value });
	},
});
const currentSize = computed({
	get() {
		return props?.pagination?.pageSize;
	},
	set(value) {
		emits('update:pagination', { ...props.pagination, pageSize: value });
	},
});

const handleSearch = () => {
	emits('handleSearch', searchFormProxy);
};
const handleReset = () => {
	searchFormProxy.value = {};
	emits('handleReset');
};
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
	multipleSelection.value = val;
};
const handleMultipleTableDelete = () => {
	if (multipleSelection.value.length === 0) return ElMessage.warning('请选择要删除的数据');
	ElMessageBox.confirm('确定批量删除这些数据吗', 'Warning', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		emits('multipleDeleteClick', multipleSelection.value);
	});
};

const beforeEditDrawerOpen = (args) => {
	emits('beforeEditDrawerOpen', args);
};
const beforeAdddialogOpen = (args) => {
	emits('beforeAdddialogOpen', args);
};
//表格点击
const handleTableEdit = (row) => {
	editFormRef.value!.editForm = JSON.parse(JSON.stringify(row));
	editFormRef.value!.drawerVisible = true;
};
const handleTableDelete = async (row) => {
	emits('deleteActionClick', row);
};

//弹窗确定点击
const handleDialogAdd = (args) => {
	emits('addActionClick', args);
};

const handleTableView = (args) => {
	emits('viewActionClick', args);
};
const handleDialogEdit = (args) => {
	emits('editActionClick', args);
};

defineExpose({
	addDialogRef,
	editFormRef,
});
</script>
<style lang="scss" scoped>
.l-table-pro {
	//在可视区域滚动
	display: flex;
	flex-direction: column;
	position: relative;
	.search-criteria {
		display: flex;
		align-items: start;
		:deep(.el-form) {
			flex: 1;
		}
		.search-btn {
			position: relative;
			display: flex;
			align-items: center;
		}
	}
	:deep(.menuLeftSlot) {
		// margin-left: 10px;
		display: flex;
		.el-button {
			margin-left: 10px;
		}
	}
	.action {
		display: flex;
		margin: 10px 0;
	}

	.pagination {
		margin-top: 20px;
		display: flex;
		// flex-direction: row-reverse;
	}
	//保证table在可视局域内撑满剩余空间
	// :deep(.el-table) {
	// 	flex: 1;
	// 	.el-table__body {
	// 		height: 100%;
	// 	}
	// }
}
.el-select-dropdown__loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100px;
	font-size: 20px;
}

.circular {
	display: inline;
	height: 30px;
	width: 30px;
	animation: loading-rotate 2s linear infinite;
}
.path {
	animation: loading-dash 1.5s ease-in-out infinite;
	stroke-dasharray: 90, 150;
	stroke-dashoffset: 0;
	stroke-width: 2;
	stroke: var(--el-color-primary);
	stroke-linecap: round;
}
.loading-path .dot1 {
	transform: translate(3.75px, 3.75px);
	fill: var(--el-color-primary);
	animation: custom-spin-move 1s infinite linear alternate;
	opacity: 0.3;
}
.loading-path .dot2 {
	transform: translate(calc(100% - 3.75px), 3.75px);
	fill: var(--el-color-primary);
	animation: custom-spin-move 1s infinite linear alternate;
	opacity: 0.3;
	animation-delay: 0.4s;
}
.loading-path .dot3 {
	transform: translate(3.75px, calc(100% - 3.75px));
	fill: var(--el-color-primary);
	animation: custom-spin-move 1s infinite linear alternate;
	opacity: 0.3;
	animation-delay: 1.2s;
}
.loading-path .dot4 {
	transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
	fill: var(--el-color-primary);
	animation: custom-spin-move 1s infinite linear alternate;
	opacity: 0.3;
	animation-delay: 0.8s;
}
@keyframes loading-rotate {
	to {
		transform: rotate(360deg);
	}
}
@keyframes loading-dash {
	0% {
		stroke-dasharray: 1, 200;
		stroke-dashoffset: 0;
	}
	50% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -40px;
	}
	100% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -120px;
	}
}
@keyframes custom-spin-move {
	to {
		opacity: 1;
	}
}
</style>
