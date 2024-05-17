<template>
	<div>
		<el-dialog
			v-model="dialogVisible"
			title="新增"
			width="40%"
			@open="addDialogOpen"
			:close-on-press-escape="false"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<div class="content">
				<el-form :model="addForm" :rules="props.addRules" label-width="auto" ref="addFormRef">
					<template v-for="formConfig in props.tableColumnConfig" :key="formConfig.field">
						<el-form-item
							v-if="formConfig.addable"
							:label="formConfig.label"
							:prop="formConfig.postField ? formConfig.postField : formConfig.field"
						>
							<template v-if="formConfig.type === 'input'">
								<el-input
									v-model="addForm[formConfig.postField ? `${formConfig.postField}` : `${formConfig.field}`]"
									:placeholder="`请输入${formConfig.label}`"
								/>
							</template>
							<template v-if="formConfig.type === 'switch'">
								<el-switch v-model="addForm[`${formConfig.field}`]" />
							</template>
							<template v-if="formConfig.type === 'time'">
								<el-date-picker
									:editable="false"
									v-model="addForm[`${formConfig.field}`]"
									:type="formConfig.timeType"
									value-format="YYYY"
									placeholder="请选择"
								/>
							</template>
							<template v-else-if="formConfig.type === 'select'">
								<el-select
									v-model="addForm[formConfig.postField ? `${formConfig.postField}` : `${formConfig.field}`]"
									:loading="formConfig.selectLoading"
									collapse-tags
									:multiple="formConfig.multiplable"
									value-key="id"
									:placeholder="`请输入${formConfig.label}`"
								>
									<el-option
										v-for="item in formConfig.searchSelectOptions"
										:key="item.id ?? item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</template>

							<template v-if="formConfig.type == 'img'">
								<!-- <image-upload
									action="https://up-z2.qiniup.com"
									:ext="['jpg', 'png', 'gif', 'jpeg']"
									@on-success="imgUpLoadSuccess($event, formConfig.field)"
									:url="addForm[`${formConfig.field}`]"
									:size="5"
									:data="{ token: imgToken }"
								></image-upload> -->
							</template>
							<template v-if="formConfig.type == 'upload'">
								<!-- <file-upload
                  action="https://up-z2.qiniup.com"
                  :ext="['pdf']"
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
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">关闭</el-button>
					<el-button type="primary" @click="addConfirm" :loading="loading"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance, DatePickType } from 'element-plus';
import { ITableColumnConfig } from '../types';
// import Qiniu from "@/api/modules/common";

const props = defineProps<{
	tableColumnConfig: ITableColumnConfig[];
	addRules: FormRules;
}>();
const addFormRef = ref<FormInstance>();
const dialogVisible = ref(false);
const addForm = ref({});
const loading = ref(false); //确认按钮loading
const emits = defineEmits<{
	addActionClick: [{ form: any; done: () => void }];
	beforeAdddialogOpen: [
		{ openLoading: () => void; closeLoading: () => void; setOption: (key: string, value: any) => void }
	];
}>();
const addConfirm = () => {
	addFormRef.value?.validate(async (valid) => {
		if (valid) {
			loading.value = true;
			emits('addActionClick', { form: addForm.value, done });
		}
	});
};
const imgToken = ref('');
// (async (_) => {
//   const res = await Qiniu.getQiniuToken();
//   imgToken.value = res.data.token;
// })();
const imgUpLoadSuccess = (url, field) => {
	// addForm.value[`${field}`] = `https://ssl.resource.synconize.com/${url.key}`;
};
const fileUpLoadSuccess = (url, field) => {
	// addForm.value[`${field}`] = `https://ssl.resource.synconize.com/${url.key}`;
};
const selectOptions = ref({});
const selectLoading = ref(false);
const closeLoading = () => {
	selectLoading.value = false;
};
const openLoading = () => {
	selectLoading.value = false;
};
const setOption = (key, value) => {
	selectOptions.value[key] = value;
};
const addDialogOpen = () => {
	emits('beforeAdddialogOpen', { openLoading, closeLoading, setOption });
};
const done = () => {
	addForm.value = {};
	loading.value = false;
	dialogVisible.value = false;
};

defineExpose({
	dialogVisible,
});
</script>
<style lang="scss" scoped>
.content {
	padding: 0 20px;
}
</style>
