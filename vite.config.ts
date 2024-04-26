import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
//使用在setup中使用name
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import viteCompression from 'vite-plugin-compression';
import components from 'unplugin-vue-components/vite'
import AutoImport from "unplugin-auto-import/vite";
import UnoCSS from "unocss/vite";
import IconsResolver from "unplugin-icons/resolver";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	return {
		plugins: [
			vue(),
			UnoCSS(),
			ElementPlus({}),
			vueSetupExtend(),
			viteCompression(),
			components({
				resolvers: [
					IconsResolver({
						enabledCollections: ["ep"],
					}),
				],
				dts: './src/types/components.d.ts',
			}),
			AutoImport({
				resolvers: [
					ElementPlusResolver(),
					IconsResolver({
						prefix: "Icon",
					}),
				],
				imports: ["vue", "vue-router", 'pinia', '@vueuse/core'],
				dts: "./src/types/auto-import.d.ts",
			}),
			createSvgIconsPlugin({
				// 这个是自己配置的图标路径，指出来（自己咋配置的咋来）
				iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
				// 这个表示id，按这个来就对了
				symbolId: "icon-[dir]-[name]",
			}),

		],
		root: process.cwd(),
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'#': path.resolve(__dirname, 'src/types'),
			},
		},
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: { exclude: ['vue-demi'], },
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT as unknown as number,
			open: JSON.parse(env.VITE_OPEN),
			hmr: true,
		},

		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
				},
			},
			outDir: 'dist',
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
					assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups!.moduleName ?? 'vender';
						}
					},
				},
			},
		},
		css: { preprocessorOptions: { css: { charset: false } } },
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});



