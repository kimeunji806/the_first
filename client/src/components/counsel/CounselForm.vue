<script setup>
import { ref ,reactive, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/user';
import { useBeneStore } from '@/stores/surBene';
import { useRoute } from 'vue-router';
import { Button } from 'primevue';

const userStore = useUserStore();
const userbeneStore = useBeneStore();
const route = useRoute();
const userNo = userStore.user_no;
const beneNo = userbeneStore.beneficiaries_no;
const surNo = userbeneStore.survey_no;
const selectNo = Number(route.params.no);



const form = reactive({
    date: '',
    title: '',
    content: '',
    file: []
});

//임시저장 목록
const tempList = ref([]);

const handleFile = (e) => {
    form.file = e.target.files;
};

//임시저장 값 불러오기
const loadTempData = (item) => {
    form.date = item.record_date?.substring(0, 10) || ''
    form.title = item.title || ''
    form.content = item.content || ''
}

const submit = async () => {
    const formData = new FormData()

    formData.append('date', form.date)
    formData.append('title', form.title)
    formData.append('content', form.content)
    formData.append('surNo', surNo)
    formData.append('beneNo', beneNo)
    formData.append('userNo', userNo)

    if (form.file.length > 0) {
        for (let i = 0; i < form.file.length; i++) {
        formData.append('file', form.file[i])
        }
    }
    try {
        await fetch(`/api/counselUpload`, {
        method: 'POST',
        body: formData
        })
        userbeneStore.refreshCounsel = !userbeneStore.refreshCounsel
        alert('등록 완료')
    } catch (err) {
        console.error(err)
        alert('에러 발생')
    }
}

//임시저장 목록 불러오기
const temporaryStorageInfo = async (surNo, wNo) => {
    
        await fetch(`/api/counselSaveInfo/${surNo}/${wNo}`)
            .then((resp) => resp.json())
            .then((data) => {
                tempList.value = Array.isArray(data) ? data : [data]
            })
}

//임시저장하기
const temporaryStorage = async () => {
    try {
        await fetch(`/api/counselSave`, {
            method : 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: form.date,
                title: form.title,
                content: form.content,
                surNo: surNo,
                wNo: userNo,
                beneNo : beneNo
            })
        })
            .then((resp) => resp.json())
            await temporaryStorageInfo(userbeneStore.survey_no, userNo)

    } catch {
        console.log((err)=>console.log(err))
    }
}

const deleteSave = async () => {
    const recordNo = tempList.value[0].record_no;

    try {
        await fetch(`/api/counselSaveDelete/${recordNo}`, {
            method : 'delete',
        })
            .then((resp) => resp.json())
            await temporaryStorageInfo(userbeneStore.survey_no, userNo)

    } catch {
        console.log((err)=>console.log(err))
    }
}

onBeforeMount(async () => {
    await userbeneStore.fetchUsers(selectNo);
    if (userbeneStore.survey_no) {
        await temporaryStorageInfo(userbeneStore.survey_no, userNo);
    }

});
</script>

<template>
    <div class="p-6 bg-slate-100 min-h-full">
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
            <div v-if="tempList.length !== 0" class="mb-4">
                <h3 class="text-sm font-bold mb-3 inline-block">임시저장 목록</h3>
                
                
                <div v-for="item in tempList" :key="item.record_no"
                @click="loadTempData(item)"
                class="p-4 mb-3 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 transition">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-400">
                        상담일자:{{ item.record_date }}
                    </span>
                    
                    <span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        임시저장
                    </span>
                    
                </div>
                
    <div class="font-semibold text-base text-gray-800 truncate">
        제목:{{ item.title || '제목 없음' }}
    </div>

    <div class="text-sm text-gray-600 mt-1 line-clamp-2">
        내용:{{ item.content || '내용 없음' }}
    </div>

    <div class="text-xs text-gray-400 mt-3 text-right">
        등록일자:{{ item.created_at }}
    </div>
    <Button @click.stop="deleteSave" class="ml-105 mt-2" severity="danger">삭제</Button>
</div>
</div>
    <h2 class="text-lg font-bold mb-4 border-b pb-2">상담기록 입력</h2>
        <div class="mb-4">
            <label class="block mb-1 text-sm">상담일</label>
            <input type="date" v-model="form.date" class="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>

        <div class="mb-4">
            <label class="block mb-1 border-t pt-2 text-sm">제목</label>
            <input type="text" v-model="form.title" class="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>

        <div class="mb-4">
            <label class="block mb-1 border-t pt-2 text-sm">내용</label>
            <textarea v-model="form.content" class="w-full border rounded px-3 py-2 bg-gray-100 h-32"></textarea>
        </div>

        <div class="mb-6 flex border-t pt-2 items-center gap-3">
            <label class="block mb-1 text-sm">첨부파일</label>
        </div>
        <input type="file" multiple @change="handleFile" />

        <div class="text-right">
            <button @click="temporaryStorage" class="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 mr-2 rounded-full">임시저장</button>
            <button @click="submit" class="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full">등록</button>
        </div>
    </div>
</div>
</template>
