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
    font-size: 1.5rem;
    font-family: var(--vp-font-family-base);
    font-weight: bolder;
    color: var(--vp-c-text-2);
    white-space: pre-wrap;
}

.hero-description {
    font-size: 2rem;
    font-family: var(--vp-font-family-base);
    font-weight: bolder;
    color: var(--vp-c-text-2);
    line-height: 2.2rem;
    -webkit-text-stroke: 0.01rem var(--vp-c-brand-1);
}

.hero-title {
    line-height: 3.2rem;
    color: transparent;
    font-size: 3rem;
    font-family: var(--vp-font-family-base);
    font-weight: bolder;
    background: linear-gradient(120deg, var(--vp-c-brand-1) 30%, #41d1ff);
    background-clip: text;
    -webkit-background-clip: text;
}
</style>