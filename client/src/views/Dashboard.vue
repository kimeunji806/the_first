<script setup>
import { onBeforeMount, reactive, ref } from 'vue';

import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const user_no = userStore.user_no;

const users = ref(null);
console.log(user_no);

onBeforeMount(async () => {
    await fetch(`/api/lists/${user_no}`)
        .then((resp) => resp.json())
        .then((data) => {
            users.value = data;
        })
        .catch((err) => console.log(err));
});

const goToDetail = (surveyNo) => {
    router.push(`/common/${surveyNo}`);
};

</script>

<template>
    <div class="flex flex-col md:flex-row gap-8 mt-6 h-screen">
        <div class="md:w-1/7">
            <div class="h-9/10">
                <div class="font-semibold text-xl mb-4">상세검색</div>
            </div>
        </div>
        <div class="md:w-6/7">
            <div class="h-9/10">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">지원신청내역</div>
                    <DataTable :value="users" :paginator="true" :rows="5" dataKey="id" :rowHover="true" showGridlines>
                        <!-- 못찾았을떄 -->
                        <template #empty> No customers found. </template>

                        <Column header="지원자명" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span>{{ data.beneficiaries_name }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="보호자명" style="min-width: 8rem">
                            <template #body="{ data }">
                                {{ data.guardian_name }}
                            </template>
                        </Column>
                        <Column header="지원신청일" style="min-width: 10rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span>{{ data.created_at }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="지원신청서" style="min-width: 8rem">
                            <template #body="{ data }">
                                <Button type="submit" label="보기" v-on:click="goToDetail(data.survey_no)" />
                            </template>
                        </Column>
                        <Column header="담당자" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span>{{ data.manager_name }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="상담내역" style="min-width: 8rem">
                            <template #body="{ data }">
                                <Button type="submit" label="보기" v-on:click="goToDetail(data.survey_no)" />
                            </template>
                        </Column>
                        <Column header="우선순위" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span>{{ data.priority_id }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="계획/결과 진행" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span>NULL</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="지원계획" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <Button type="submit" label="보기" v-on:click="goToDetail(data.survey_no)" />
                                </div>
                            </template>
                        </Column>
                        <Column header="지원결과" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <Button type="submit" label="보기" v-on:click="goToDetail(data.survey_no)" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
