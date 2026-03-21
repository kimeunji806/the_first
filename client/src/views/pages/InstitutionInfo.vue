<script setup>
import { ref, onBeforeMount } from 'vue';
const institution = ref({});

const findAllInfo = async () => {
    let info = await fetch(`http://localhost:3000/institutions`)
        .then((res) => res.json())
        .catch((err) => console.log(err));
    institution.value = info;
};

onBeforeMount(() => {
    findAllInfo();
});
</script>
<template>
    <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">내 기관 정보</h2>

        <div v-if="institution">
            <p><strong>기관</strong> {{ inst.name }}</p>
            <p><strong>사업자번호</strong> {{ inst.tel }}</p>
            <p><strong>대표번호:</strong> {{ inst.institution_tel }}</p>
            <p><strong>주소:</strong> {{ inst.institution_address }}</p>
            <p><strong>이메일:</strong> {{ inst.institution_email }}</p>
            <p><strong>운영여부:</strong> {{ inst.operation }}</p>
        </div>

        <div v-else>로딩중...</div>
    </div>
</template>
