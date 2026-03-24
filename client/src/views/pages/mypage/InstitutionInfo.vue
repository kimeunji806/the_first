<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const institution = ref(null);
const activeTab = ref(route.query.tab || '0');

// 기관정보 조회
const findAllInfo = async () => {
    try {
        const res = await fetch(`/api/institutioninfo`);
        const info = await res.json();
        institution.value = info;
    } catch (err) {
        console.log(err);
    }
};

// 기관정보 수정 탭으로 이동
const goToEditForm = () => {
    router.push({
        path: '/institutioninfo/edit',
        query: { tab: '1' } // 기관정보 탭을 활성화하기 위한 파라미터
    });
};

onBeforeMount(() => {
    findAllInfo();
});
</script>
<template>
    <div class="w-full">
        <div class="w-full">
            <div class="card">
                <Tabs v-model:value="activeTab">
                    <TabList>
                        <Tab value="0">내 정보</Tab>
                        <Tab value="1">기관정보</Tab>
                    </TabList>
                </Tabs>

                <div v-if="activeTab === '1' && institution" class="mt-4">
                    <div class="font-semibold text-xl mb-4">기관정보</div>
                    <DataTable
                        :value="[
                            { label: '기관', value: institution.name },
                            { label: '사업자번호', value: institution.tel },
                            { label: '대표번호', value: institution.institution_tel },
                            { label: '주소', value: institution.institution_address },
                            { label: '이메일', value: institution.institution_email },
                            { label: '운영여부', value: institution.operation === 1 ? '여' : '부' }
                        ]"
                    >
                        <Column field="label" header="" class="w-3xs"></Column>
                        <Column field="value" header=""></Column>
                    </DataTable>
                </div>

                <div v-else-if="activeTab === '1'" class="mt-4">로딩중...</div>

                <div class="flex justify-end mt-4">
                    <Button label="수정" @click="goToEditForm"></Button>
                </div>
            </div>
        </div>
    </div>
</template>
