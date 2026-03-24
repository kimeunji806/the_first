<script setup>
import { computed } from 'vue';

const props = defineProps({
    // 지원대상자 목록
    targets: {
        type: Array,
        default: () => []
    },

    // 현재 선택된 대상자 id
    selectedId: [String, Number]
});

const emit = defineEmits(['select', 'add']);

// 현재 선택된 id
const selected = computed(() => props.selectedId);

// 목록 항목 클릭
function onItemClick(target) {
    emit('select', target.id);
}

// 등록 버튼 클릭
function onAdd() {
    emit('add');
}
</script>

<template>
    <div class="w-full bg-surface-0 dark:bg-surface-900">
        <!-- 제목 -->
        <div class="mb-5">
            <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-1">등록된 지원대상자</div>
            <span class="text-muted-color"> 등록된 대상자를 선택하거나 새로 등록할 수 있습니다. </span>
        </div>

        <!-- 목록 -->
        <div class="flex flex-col gap-2 mb-4">
            <button
                v-for="target in targets"
                :key="target.id"
                type="button"
                @click="onItemClick(target)"
                class="w-full text-left px-4 py-3 border rounded-lg transition-colors"
                :class="selected === target.id ? 'border-primary bg-primary text-primary-contrast' : 'border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0'"
            >
                <!-- 이름 -->
                <div class="font-medium mb-1">
                    {{ target.name }}
                </div>

                <!-- 관계 -->
                <div class="text-sm" :class="selected === target.id ? 'text-primary-contrast' : 'text-muted-color'">
                    {{ target.relation || '관계 미입력' }}
                </div>
            </button>

            <!-- 데이터 없을 때 -->
            <div v-if="targets.length === 0" class="text-muted-color py-4">지원대상자가 없습니다.</div>
        </div>

        <!-- 등록 버튼 -->
        <Button label="지원대상자 등록" class="w-full" @click="onAdd" />
    </div>
</template>
