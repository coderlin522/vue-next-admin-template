import type { App } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"
const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const timePulgin = {
  mounted(el: HTMLElement, binds: any): void {
    // 将毫秒转成格式化的时间
    if (el.textContent) {
      if (binds.value) {
        el.textContent = dayjs(0).second
          (Number.parseInt(el.textContent))
          .format(binds.value);
      } else {
        el.textContent = dayjs(0)
          .second(Number.parseInt(el.textContent))
          .format(DATE_TIME_FORMAT);
      }
    }
  },
};
export default {
  install(app: App) {
    app.directive("init-time", timePulgin);
  },
};
