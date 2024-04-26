
<template>
	<el-config-provider :locale="getGlobalI18n">
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts" name="app">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';
import { useThemeConfig } from '@/stores/themeConfig';
import other from '@/utils/other';
import { Local, Session } from '@/utils/storage';
import mittBus from '@/utils/mitt';

// 引入组件

// 定义变量内容
const { messages, locale } = useI18n();
const route = useRoute();
const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();

// 获取全局 i18n
const getGlobalI18n = computed(() => {
	//仅解决类型问题
	return messages.value[locale.value] as any;
});
// 设置初始化，防止刷新时恢复默认

// 页面加载时
onMounted(() => {
	nextTick(() => {
		
		// 获取缓存中的布局配置
		if (Local.get('themeConfig')) {
			locale.value=Local.get('themeConfig').globalI18n
			storesThemeConfig.setThemeConfig({ themeConfig: Local.get('themeConfig') });
			document.documentElement.style.cssText = Local.get('themeConfigStyle');
		}
		// 获取缓存中的全屏配置
		if (Session.get('isTagsViewCurrenFull')) {
			stores.setCurrenFullscreen(Session.get('isTagsViewCurrenFull'));
		}
	});
});

// 监听路由的变化，设置网站标题
watch(
	() => route.path,
	() => {
		other.useTitle();
	},
	{
		deep: true,
	}
);
</script>
