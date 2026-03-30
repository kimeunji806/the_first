<script setup>
import { ref , onBeforeMount } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const ins_no = userStore.institution;

const approvalList = ref([]);

const approval = async (ins_no) => {
    await fetch(`/api/approval/${ins_no}`)
        .then((resp) => resp.json())
        .then((data) => {           
            approvalList.value = Array.isArray(data) ? data : [data];

        })
        .catch(err => console.log(err))
}


const approvalAcess = async(e) => {
    const tr = e.target.closest('tr');
    const userId = tr.children[2].innerText;
    const userName = tr.children[1].innerText;
    let result = await fetch('/api/access', {
        method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
    })
        .then((resp) => resp.json())
        .catch((err) => console.log(err))

    if (result.update == "success") {
        alert(`${userName}님의 회원가입 승인처리 완료`)
        await approval(ins_no);
    } else {
        alert('승인처리 중에 문제가 생겼습니다')
    }
}


const approvalRefuse = async (e) => {
    const tr = e.target.closest('tr');
    const userId = tr.children[2].innerText;
    const userName = tr.children[1].innerText;
    let result = await fetch('/api/access/refuse', {
        method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
    })
        .then((resp) => resp.json())
        .catch((err) => console.log(err))

    if (result.update == "success") {
        alert(`${userName}님의 회원가입 반려처리 완료`)
        await approval(ins_no);
    } else {
        alert('반려처리 중에 문제가 생겼습니다')
    }
}


onBeforeMount(() => {
    approval(ins_no);
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
                'approval',
                'refuse'
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
                    @click="approvalAcess"/>
                </template>
            </Column>
            <Column field="refuse" header="반려">
            <template #body="slotProps"> 
                <Button
                    label="반려"
                    severity="danger"
                    size="small"
                    @click="approvalRefuse"/>
                </template>
            </Column>
        </DataTable>
    </div>
</template>