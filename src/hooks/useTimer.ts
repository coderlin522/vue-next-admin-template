export const useTimer = (countdown: number = 60) => {
  const count = ref(countdown)
  const timer = ref<NodeJS.Timeout>();
  const loading = ref(false)
  const tips = ref("发送验证码")
  const isFirst = ref(true)
  const start = () => {
    if (count.value <= 0) count.value = countdown
    isFirst.value = false
    loading.value = true
    timer.value = setInterval(() => {
      count.value--;
      tips.value = `${count.value}秒后重新发送`
      if (count.value <= 0) {
        count.value = 0
        if (!isFirst.value) tips.value = "重新发送"
        isFirst.value = false
        loading.value = false
        clearInterval(timer.value);
      }
    }, 1000);
  }

  return {
    start, count, loading, tips
  }
}