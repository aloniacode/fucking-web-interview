<script setup lang="ts">
interface Props {
    text: string;
    textColor: string;
    bgColor: string;
}
const { text, textColor = '#fff', bgColor = '#c96442' } = defineProps<Props>()
</script>

<template>
    <span class="container" :style="{color:textColor,backgroundColor:bgColor }">
        {{ text }}
    </span>
</template>

<style scoped>
.container {
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
}
</style>
