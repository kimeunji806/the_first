<script setup>
import { computed, ref } from 'vue';
import TargetList from './TargetList.vue';
import TargetDetail from './TargetDetail.vue';

const targets = ref([
    { id: 1, name: '김철수', email: 'chulsoo@example.com', phone: '010-1234-5678' },
    { id: 2, name: '이영희', email: 'younghee@example.com', phone: '010-9876-5432' }
]);

const selectedId = ref(targets.value.length ? targets.value[0].id : null);

const newId = ref(targets.value.length + 1);

function selectTarget(id) {
    selectedId.value = id;
}

function addTarget() {
    const name = prompt('새 지원대상자 이름을 입력하세요.');
    if (!name || !name.trim()) {
        alert('이름을 입력해야 합니다.');
        return;
    }

    targets.value.push({
        id: newId.value++,
        name: name.trim(),
        email: '',
        phone: '',
        status: '신규'
    });

    selectedId.value = targets.value[targets.value.length - 1].id;
}

function updateTarget(updated) {
    const idx = targets.value.findIndex((t) => t.id === updated.id);
    if (idx === -1) return;
    targets.value[idx] = { ...targets.value[idx], ...updated };
}

const selectedTarget = computed(() => targets.value.find((item) => item.id === selectedId.value) || null);
</script>

<template>
    <div style="display: grid; grid-template-columns: 350px 1fr; gap: 1rem; margin-top: 1rem">
        <TargetList :targets="targets" :selectedId="selectedId" @select="selectTarget" @add="addTarget" />
        <TargetDetail :target="selectedTarget" @updated="updateTarget" />
    </div>
</template>
