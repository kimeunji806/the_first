<script setup>
import { ref,onBeforeMount } from 'vue';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const logOut = () => {
    userStore.logout();
};

const userIns = userStore.institution;
const institutionTel = ref('');


const insTel = async (no) => {
    const resp = await fetch(`/api/institution/${no}`)
    const data = await resp.json()
    console.log(data)
    institutionTel.value = data.tel
}

onBeforeMount(() => {
    insTel(userIns);
})



</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-full min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                    <div class="gap-4 flex flex-col items-center">
                        <div class="flex justify-center items-center border-2 border-orange-500 rounded-full" style="width: 3.2rem; height: 3.2rem">
                            <i class="text-orange-500 pi pi-fw pi-lock text-2xl!"></i>
                        </div>
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl mb-2">승인대기</h1>
                        <span class="text-muted-color mb-8">관리자의 승인을 기다리고 있습니다</span>
                        <img src="/demo/images/access/asset-access.svg" alt="Access denied" class="mb-8" width="80%" />
                        <i class = "pi pi-exclamation-circle"> 문의사항은 기관으로 연락 바랍니다</i>
                        <span class="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                            기관대표 번호 : {{ institutionTel }}
                        </span>
                        <div class="col-span-12 mt-8 text-center">
                            
                            <Button as="router-link" label="로그인페이지로 돌아가기" to="/sign/login" severity="warn" @click="logOut" />
                        </div>
                        <div class="col-span-12 mt-8 text-center">
                            <Button as="router-link" label="로그아웃" to="/sign/login" class="accessBtn" @click="logOut" />
                            <Button as="router-link" label="회원탈퇴" to="/sign/login" class="accessBtn" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.accessBtn {
    margin: 10px;
}
</style>
