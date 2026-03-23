<script setup>
import { ref , onBeforeMount } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
const approvalList = ref([]);


const approval = async () => {
    await fetch(`/api/approval`)
        .then((resp) => resp.json())
        .then((data) => {           
            approvalList.value = Array.isArray(data) ? data : [data];

        })
        .catch(err => console.log(err))
}

onBeforeMount(() => {
    approval();
})


const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">회원가입 승인요청</div>

        <!-- 검색 -->
        <div class="flex justify-between mb-3">
            <InputText v-model="filters.global.value" placeholder="검색" />
        </div>

        <DataTable
            :value="approvalList"
            :paginator="true"
            :rows="10"
            v-model:filters="filters"
            :filters="filters"
            :globalFilterFields="[
                'no',
                'name',
                'id',
                'ins',
                'tel',
                'email',
                'created_at',
                'approval'
            ]"
        >
            <Column field="no" header="번호"></Column>
            <Column field="name" header="이름"></Column>
            <Column field="id" header="아이디"></Column>
            <Column field="ins" header="기관명"></Column>
            <Column field="tel" header="연락처"></Column>
            <Column field="email" header="이메일"></Column>
            <Column field="created_at" header="가입일"></Column>
            <Column field="approval" header="사용승인">
                <template #body="slotProps">
                <Button
                    label="승인"
                    severity="success"
                    size="small"
                    @click=""/>
                </template>
            </Column>
        </DataTable>
    </div>
</template>