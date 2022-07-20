<template>
<layout>
    <PageHeader :title="title" /> {{user}}
</layout>
</template>
<script setup>
import state from '@/state/';
import PageHeader from '@/components/page-header.vue';
import layout from '../components/layouts/main.vue';

const title = 'Anasayfa';
const user = state.getters['auth/getCurrentUser'];
</script>
