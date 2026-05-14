<script setup>
import TypeIt from 'typeit';
import { useData } from 'vitepress';
import { onMounted, ref } from 'vue';

const { frontmatter } = useData();
const { name, text, tagline } = frontmatter.value.hero;
const typedText = ref(null)
onMounted(() => {
    new (TypeIt)(typedText.value, {
        strings: [`{ ${name} }`, "Interview is Devil"],
        cursorChar: "<span style='color: var(--vp-c-brand-1);'>|<span>",//用于光标的字符。HTML也可以
        speed: 100,
        lifeLike: true,// 使打字速度不规则
        cursor: true,//在字符串末尾显示闪烁的光标
        breakLines: false,// 控制是将多个字符串打印在彼此之上，还是删除这些字符串并相互替换
        loop: true,//是否循环
    }).go()
})
</script>

<template>
    <div class="hero">
        <span ref="typedText" class="hero-title"></span>
        <div class="hero-description">{{ text }}</div>
        <div class="hero-tagline">🔍 {{ tagline }}</div>
    </div>
</template>

<style scoped>
.hero {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.hero-tagline {
    font-size: 1.1rem;
    font-family: var(--vp-font-family-base);
    color: var(--vp-c-text-3);
}

.hero-description {
    font-size: 1.25rem;
    font-family: var(--vp-font-family-base);
    font-weight: 500;
    color: var(--vp-c-text-2);
    line-height: 1.6;
}

.hero-title {
    line-height: 1.2;
    color: transparent;
    font-size: 3.5rem;
    font-family: Georgia, 'Noto Serif SC', serif;
    font-weight: 700;
    background: linear-gradient(135deg, var(--vp-c-text-1) 30%, var(--vp-c-brand-1));
    background-clip: text;
    -webkit-background-clip: text;
}
</style>