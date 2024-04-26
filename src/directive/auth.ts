import type { App } from 'vue';
import { useUserInfo } from '@/stores/userInfo';

const auth = {
  mounted(el, binding) {
    binding.value = binding.value ?? []
    if (binding.value.length == 0) return
    const stores = useUserInfo();
    //根据实际需求进行修改
    if (!binding.value.includes(stores.userInfos.roles[0])) el.parentNode.removeChild(el);
  },
}

export default {
  install(app: App) {
    app.directive('auth', auth)
  }
}