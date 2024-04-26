/**
 *
 * @param props props对象
 * @param propsProxy 需要代理的props中的对象
 * @param emits emit事件
 * @returns props代理对象
 */
// Extract<keyof T, string>  keyof T 可能有symbol类型  选取只有string的
const useVModelProps = <
  T extends Record<string, any>,
  K extends Extract<keyof T, string>
>(
  props: T,
  propsProxy: K,
  emits: (event, ...args: any[]) => void
) => {
  const propsDataProxy = ref({} as T[K]);
  for (const key in props[propsProxy]) {
    propsDataProxy.value[key] = computed({
      get() {
        return props[propsProxy][key];
      },
      set(newval) {
        emits(`update:${propsProxy}`, { ...props[propsProxy], [key]: newval });
      },
    });
  }
  //保证不写参数时 响应式
  if (Reflect.ownKeys(props[propsProxy]).length <= 0) {
    watch(propsDataProxy.value, (newval) => {
      console.log(newval);
      emits(`update:${propsProxy}`, newval);
    })
  }
  return propsDataProxy;
};
export default useVModelProps;
