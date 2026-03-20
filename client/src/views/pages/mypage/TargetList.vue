<script setup>
import { computed } from 'vue';

const props = defineProps({
    targets: { type: Array, default: () => [] },
    selectedId: [String, Number]
});

const emit = defineEmits(['select', 'add']);

const selected = computed(() => props.selectedId);

function onItemClick(target) {
    emit('select', target.id);
}

function onAdd() {
    emit('add');
}
</script>

<template>
    <div class="mypage-left" style="padding: 1rem; border: 1px solid #d9d9d9; border-radius: 8px">
        <h3 style="margin-bottom: 0.75rem">등록된 지원대상자</h3>
        <div style="min-height: 280px; max-height: 360px; overflow-y: auto">
            <button
                v-for="target in targets"
                :key="target.id"
                :class="['list-item', { active: selected === target.id }]"
                @click="onItemClick(target)"
                style="display: block; width: 100%; text-align: left; margin-bottom: 0.4rem; padding: 0.55rem 0.8rem; border: 1px solid #ccc; border-radius: 5px; background: white"
            >
                {{ target.name }} {{ target.status }}
            </button>
            <p v-if="targets.length === 0" style="color: #888">지원대상자가 없습니다.</p>
        </div>

        <button @click="onAdd" style="margin-top: 1rem; width: 100%; padding: 0.7rem; background-color: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer">지원대상자 등록</button>
    </div>
</template>

<style scoped>
.list-item.active {
    border-color: #999;
    background: #f8f8f8;
}

button:focus {
    outline: none;
    box-shadow: none;
}
</style>
