<template>
  <svg :style="{ width: props.width, height: props.height }">
    <use :xlink:href="svgName" :fill="props.color"></use>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color?: string;
    width?: string;
    height?: string;
    name: string;
  }>(),
  {
    width: "15px",
    height: "15px",
  },
);
const svgName = computed(() => `#icon-${props.name}`);
</script>

<style scoped></style>
