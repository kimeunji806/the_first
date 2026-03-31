<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import AdminMyInfo from './AdminMyInfo.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const institution = ref(null);
const activeTab = ref(Number(route.query.tab ?? 0));

watch(
    () => route.query.tab,
    (newTab) => {
        activeTab.value = Number(newTab ?? 0);
    }
);

const findAllInfo = async () => {
    try {
        const insNo = userStore.institution;
        const res = await fetch(`/api/admin/institutioninfo/${insNo}`);
        const info = await res.json();
        institution.value = info;
    } catch (err) {
        console.log(err);
    }
};
const changeTab = (tabValue) => {
    router.push({
        path: '/admin/mypage',
        query: { tab: String(tabValue) }
    });
};
const goToEditForm = () => {
    router.push({
        path: '/admin/institutioninfo/edit',
        query: { tab: '1' }
    });
};

onBeforeMount(() => {
    findAllInfo();
});
</script>

<template>
    <div class="w-full">
        <div class="card">
            <Tabs v-model:value="activeTab">
                <TabList>
                    <Tab :value="0">내 정보</Tab>
                    <Tab :value="1">기관정보</Tab>
                </TabList>
            </Tabs>

            <div v-if="activeTab === 0" class="mt-4">
                <AdminMyInfo />
            </div>

            <div v-else-if="activeTab === 1" class="mt-4">
                <div v-if="institution">
                    <div class="mb-5">
                        <div class="text-surface-900 dark:text-surface-0 text-2xl font-medium mb-1">마이페이지</div>
                        <span class="text-muted-color"> 기관관리자 기관 정보를 확인할 수 있습니다. </span>
                    </div>
                    <DataTable
                        :value="[
                            { label: '기관', value: institution.name },
                            { label: '사업자번호', value: institution.business_number },
                            { label: '대표번호', value: institution.tel },
                            { label: '주소', value: institution.institution_address },
                            { label: '이메일', value: institution.institution_email },
                            { label: '운영여부', value: institution.operation === 1 ? '여' : '부' }
                        ]"
                    >
                        <Column field="label" header="" class="w-3xs" />
                        <Column field="value" header="" />
                    </DataTable>

                    <div class="flex justify-end mt-4">
                        <Button label="수정" @click="goToEditForm" />
                    </div>
                </div>

                <div v-else>로딩중...</div>
            </div>
        </div>
    </div>
</template>
