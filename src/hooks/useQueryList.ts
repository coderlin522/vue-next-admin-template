import { ref, watch } from "vue";

//有分页的数据
interface PaginationData<T> {
  data: T;
  total: number;
}

type anyObject = {
  [key: string]: any;
};
type ReturnPromiseType<T> = T extends (
  ...args: any[]
) => Promise<PaginationData<infer U>>
  ? U
  : never;

interface useQueryListOptions<T> {
  watchPage?: boolean; //分页条件改变是否自动请求
  fetchParams?: T; //查询参数
  pageSize?: number; //每页显示条数
}
const useQueryList = <T extends (...args: any) => any, K = Record<string, any>>(
  apiFn: T,
  options?: useQueryListOptions<K>
) => {
  const list = ref<ReturnPromiseType<T>>() as unknown as Ref<
    ReturnPromiseType<T>
  >;
  const total = ref(0);
  
  const searchForm = ref({}) as Ref<K>;

  const errorMsg = ref();
  const loading = ref(false);
  const pagination = ref({
    currentPage: 1,
    pageSize: options?.pageSize ?? 10,
  });

  if (options?.fetchParams) {
    Reflect.ownKeys(options.fetchParams).forEach((key) => {
      searchForm.value[key] = options.fetchParams![key];
    });
  }

  const getList = async () => {
    loading.value = true;
    try {
      const res = await apiFn({
        ...pagination.value,
        ...searchForm.value,
      });
      list.value = res.data;
      total.value = res.total;
    } catch (error) {
      //错误处理
      console.log(error);
      errorMsg.value = error;
    } finally {
      loading.value = false;
    }
  };
  getList();
  if (options?.watchPage) {
    watch(pagination, async () => await getList(), { deep: true });
  }
  return {
    list,
    searchForm,
    pagination,
    total,
    loading,
    errorMsg,
    getList,
  };
};
export default useQueryList;
