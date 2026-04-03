<script setup>
import { ref, onBeforeMount } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

const approvalList = ref([]);

const approval = async () => {
    await fetch(`/api/admin-approval`)
        .then((resp) => resp.json())
        .then((data) => {
            approvalList.value = Array.isArray(data) ? data : [data];
        })
        .catch((err) => console.log(err));
};

const approvalAcess = async (data) => {
    const userId = data.id;
    const userName = data.name;

    let result = await fetch('/api/access', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
        .then((resp) => resp.json())
        .catch((err) => console.log(err));

    if (result.update == 'success') {
        alert(`${userName}님의 회원가입 승인처리 완료`);
        await approval();
    } else {
        alert('승인처리 중에 문제가 생겼습니다');
    }
};

const approvalRefuse = async (data) => {
    const userId = data.id;
    const userName = data.name;

    let result = await fetch('/api/access/refuse', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
        .then((resp) => resp.json())
        .catch((err) => console.log(err));

    if (result.update == 'success') {
        alert(`${userName}님의 회원가입 반려처리 완료`);
        await approval();
    } else {
        alert('반려처리 중에 문제가 생겼습니다');
    }
};

onBeforeMount(() => {
    approval();
});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <div class="font-semibold text-xl">회원가입 승인요청</div>

            <div class="flex gap-2">
                <InputText v-model="keyword" placeholder="검색" class="w-72" @keydown="handleSearchEnter" />
                <Button icon="pi pi-search" @click="searchNotice" />
                <Button icon="pi pi-refresh" severity="secondary" outlined @click="resetSearch" />
            </div>
        </div>

        <DataTable :value="approvalList" :paginator="true" :rows="10" v-model:filters="filters" :filters="filters" :globalFilterFields="['no', 'name', 'id', 'ins', 'tel', 'email', 'created_at', 'approval', 'refuse']">
            <Column field="no" header="번호"></Column>
            <Column field="name" header="이름"></Column>
            <Column field="id" header="아이디"></Column>
            <Column field="ins" header="기관명"></Column>
            <Column field="tel" header="연락처"></Column>
            <Column field="email" header="이메일"></Column>
            <Column field="created_at" header="가입일"></Column>
            <Column field="approval" header="사용승인">
                <template #body="slotProps">
                    <Button label="승인" severity="success" size="small" @click="approvalAcess(slotProps.data)" />
                </template>
            </Column>
            <Column field="refuse" header="반려">
                <template #body="slotProps">
                    <Button label="반려" severity="danger" size="small" @click="approvalRefuse(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
