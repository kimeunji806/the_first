<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';

</script>

<template>
    <div class="flex flex-col md:flex-row gap-8 mt-6 h-screen">
        <div class="md:w-1/5">
            <div class="h-9/10">
                <div class="font-semibold text-xl mb-4">지원자 정보 입력</div>
            </div>
        </div>
        <div class="md:w-4/5">
            <div class="h-9/10">
                <div class="font-semibold text-xl mb-4">지원신청하기</div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
