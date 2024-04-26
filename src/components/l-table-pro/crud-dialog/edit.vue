<template>
	<el-drawer
		v-model="drawerVisible"
		direction="rtl"
		title="编辑"
		@open="editDrawerOpen"
		:close-on-click-modal="false"
		size="40%"
	>
		<template #default>
			<div class="content" v-loading="tableLoading">
				<el-form :model="editForm" :rules="props.editRules" label-width="80" ref="editFormRef">
					<template v-for="formConfig in props.tableColumnConfig" :key="formConfig.field">
						<el-form-item :label="formConfig.label" :prop="formConfig.field" v-if="formConfig.editable">
							<template v-if="formConfig.type === 'input'">
								<el-input v-model="editForm[`${formConfig.field}`]" :placeholder="`请输入${formConfig.label}`" />
							</template>
							<template v-if="formConfig.type === 'switch'">
								<el-switch v-model="editForm[`${formConfig.field}`]" />
							</template>
							<template v-if="formConfig.type === 'time'">
								<el-date-picker
									:editable="false"
									v-model="editForm[`${formConfig.field}`]"
									:type="formConfig.timeType"
									:default-value="editForm[`${formConfig.field}`]"
									placeholder="请选择"
								/>
							</template>
							<template v-else-if="formConfig.type === 'select'">
								<el-select
									v-model="editForm[`${formConfig.field}`]"
									collapse-tags
									:multiple="formConfig.multiplable"
									value-key="id"
									:placeholder="`请选择${formConfig.label}`"
								>
									<el-option
										v-for="item in formConfig.searchSelectOptions"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</template>
							<template v-if="formConfig.type == 'img'">
								<image-upload
									action="https://up-z2.qiniup.com"
									:ext="['jpg', 'png', 'gif', 'jpeg']"
									@on-success="imgUpLoadSuccess($event, formConfig.field)"
									:url="editForm[`${formConfig.field}`]"
									:size="5"
									:data="{ token: imgToken }"
								></image-upload>
							</template>
							<template v-if="formConfig.type == 'upload'">
								<!-- <file-upload
                  action="https://up-z2.qiniup.com"
                  :ext="['pdf']"
                  :files="[
                    {
                      name: formConfig.field,
                      url: editForm[`${formConfig.field}`],
                    },
                  ]"
                  :max="1"
                  :data="{ token: imgToken }"
                  @on-success="fileUpLoadSuccess($event, formConfig.field)"
                  :size="500"
                ></file-upload> -->
							</template>
						</el-form-item>
					</template>
				</el-form>
			</div>
		</template>
		<template #footer>
			<div class="py-10 mr-10">
				<el-button @click="drawerVisible = false">取消</el-button>
				<el-button type="primary" @click="editConfirm" :loading="loading">确定</el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules, DatePickType } from 'element-plus';
import { ITableColumnConfig } from '../types';

const props = defineProps<{
	tableColumnConfig: ITableColumnConfig[];
	editRules: FormRules;
}>();
const selectOptions = ref({});
const editFormRef = ref<FormInstance>();
const drawerVisible = ref(false);
const editForm = ref({});
const loading = ref(false);
const tableLoading = ref(false);
const emits = defineEmits<{
	editActionClick: [{ row: any; done: () => void }];
	beforeEditDrawerOpen: [
		{
			row: any;
			openLoading: () => void;
			closeLoading: () => void;
			setOption: (key: string, value: any) => void;
			setForm: (key: string, value: any) => void;
		}
	];
}>();
const editConfirm = () => {
	editFormRef.value?.validate(async (valid) => {
		if (valid) {
			loading.value = true;
			emits('editActionClick', { row: editForm.value, done });
		}
	});
};
const imgToken = ref('');
const imgUpLoadSuccess = (url, field) => {
	// editForm.value[`${field}`] = `https://ssl.resource.synconize.com/${url.key}`;
};
const fileUpLoadSuccess = (url, field) => {
	// editForm.value[`${field}`] = `https://ssl.resource.synconize.com/${url.key}`;
};
const closeLoading = () => {
	tableLoading.value = false;
};
const openLoading = () => {
	tableLoading.value = true;
};
const setOption = (key, value) => {
	selectOptions.value[key] = value;
};
const setForm = (key, value) => {
	editForm.value[key] = value;
};
const done = () => {
	editForm.value = {};
	tableLoading.value = false;
	drawerVisible.value = false;
	loading.value = false;
};
const editDrawerOpen = () => {
	emits('beforeEditDrawerOpen', {
		row: editForm.value,
		openLoading,
		closeLoading,
		setOption,
		setForm,
	});
};
defineExpose({
	drawerVisible,
	editForm,
});
</script>
<style lang="scss" scoped>
.content {
	padding: 20px;
}
</style>
