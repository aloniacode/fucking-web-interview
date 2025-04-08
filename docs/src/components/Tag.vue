<script setup lang="ts">
interface Props {
    text: string;
    textColor: string;
    bgColor: string;
}
const { text, textColor = '#fff', bgColor = 'oklch(0.52 0.105 223.128)' } = defineProps<Props>()
</script>

<template>
    <span class="container" :style="{color:textColor,backgroundColor:bgColor }">
        {{ text }}
    </span>
</template>

<style scoped>
.container {
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 14px;
}
</style>