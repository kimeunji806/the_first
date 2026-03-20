<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
    target: { type: Object, default: null }
});
const emit = defineEmits(['updated']);

const mode = ref('view');
const form = reactive({ id: null, name: '', email: '', phone: '', status: '' });

watch(
    () => props.target,
    (value) => {
        if (value) {
            mode.value = 'view';
            form.id = value.id;
            form.name = value.name;
            form.email = value.email;
            form.phone = value.phone;
            form.status = value.status;
        } else {
            mode.value = 'view';
            form.id = null;
            form.name = '';
            form.email = '';
            form.phone = '';
            form.status = '';
        }
    },
    { immediate: true }
);

function editMode() {
    mode.value = 'edit';
}

function cancelEdit() {
    if (props.target) {
        form.name = props.target.name;
        form.email = props.target.email;
        form.phone = props.target.phone;
        form.status = props.target.status;
    }
    mode.value = 'view';
}

function save() {
    if (!form.name.trim()) {
        alert('이름은 필수입니다.');
        return;
    }
    emit('updated', { ...form });
    mode.value = 'view';
}
</script>

<template>
    <div class="mypage-right" style="padding: 1rem; border: 1px solid #d9d9d9; border-radius: 8px">
        <h3>지원대상자 정보</h3>

        <div v-if="!props.target" style="color: #777; margin-top: 0.8rem">왼쪽에서 대상자를 선택하세요.</div>

        <div v-else>
            <template v-if="mode === 'view'">
                <dl style="margin-top: 0.8rem; line-height: 1.8">
                    <dt><strong>이름</strong></dt>
                    <dd>{{ props.target.name }}</dd>
                    <dt><strong>이메일</strong></dt>
                    <dd>{{ props.target.email }}</dd>
                    <dt><strong>전화번호</strong></dt>
                    <dd>{{ props.target.phone }}</dd>
                    <dt><strong>상태</strong></dt>
                    <dd>{{ props.target.status }}</dd>
                </dl>
                <button @click="editMode" style="margin-top: 1rem; padding: 0.55rem 0.9rem; background-color: #10b981; color: white; border: 0; border-radius: 5px; cursor: pointer">수정</button>
            </template>

            <template v-else>
                <div style="margin-top: 0.8rem; display: grid; gap: 0.75rem">
                    <label>이름 <input v-model="form.name" type="text" style="width: 100%; border: 1px solid #ccc; border-radius: 4px; padding: 0.45rem" /></label>
                    <label>이메일 <input v-model="form.email" type="email" style="width: 100%; border: 1px solid #ccc; border-radius: 4px; padding: 0.45rem" /></label>
                    <label>전화번호 <input v-model="form.phone" type="text" style="width: 100%; border: 1px solid #ccc; border-radius: 4px; padding: 0.45rem" /></label>
                    <label>상태 <input v-model="form.status" type="text" style="width: 100%; border: 1px solid #ccc; border-radius: 4px; padding: 0.45rem" /></label>
                    <div style="display: flex; gap: 0.7rem">
                        <button @click="save" style="padding: 0.55rem 0.9rem; background: #2563eb; color: white; border: 0; border-radius: 5px; cursor: pointer">저장</button>
                        <button @click="cancelEdit" style="padding: 0.55rem 0.9rem; background: #9ca3af; color: white; border: 0; border-radius: 5px; cursor: pointer">취소</button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
