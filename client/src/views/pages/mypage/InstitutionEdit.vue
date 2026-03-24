<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';

const route = useRoute();
const router = useRouter();

const activeTab = ref(route.query.tab || '0');
const institution = ref({});

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

// 기관정보 수정
const save = async () => {
    try {
        const dataToSave = {
            name: institution.value.name,
            tel: institution.value.tel,
            institution_tel: institution.value.institution_tel,
            institution_address: institution.value.institution_address,
            institution_email: institution.value.institution_email,
            operation: institution.value.operation
        };
        const res = await fetch('/api/institutioninfo', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSave)
        });

        if (res.ok) {
            const result = await res.json();
            console.log('수정 완료 : ', result);

            router.push({ path: '/institutioninfo', query: { tab: '1' } });
        } else {
            console.error('수정 실패:', res.statusText);
        }
    } catch (err) {
        console.log(err);
    }
};

onBeforeMount(findAllInfo);
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
                            { label: '기관', field: 'name' },
                            { label: '사업자번호', field: 'tel' },
                            { label: '대표번호', field: 'institution_tel' },
                            { label: '주소', field: 'institution_address' },
                            { label: '이메일', field: 'institution_email' },
                            { label: '운영여부', field: 'operation' }
                        ]"
                    >
                        <Column field="label" header="" class="w-3xs"></Column>
                        <Column field="field" header="">
                            <template #body="slotProps">
                                <span v-if="slotProps.data.field === 'tel'">{{ institution.tel }}</span>
                                <div v-else-if="slotProps.data.field === 'operation'" class="flex gap-4">
                                    <div class="flex items-center">
                                        <RadioButton id="option1" name="operation" :value="1" v-model="institution.operation" />
                                        <label for="option1" class="ml-2">여</label>
                                    </div>
                                    <div class="flex items-center">
                                        <RadioButton id="option2" name="operation" :value="0" v-model="institution.operation" />
                                        <label for="option2" class="ml-2">부</label>
                                    </div>
                                </div>
                                <div v-else-if="slotProps.data.field === 'institution_address'" class="flex flex-col gap-2 w-full">
                                    <div class="flex gap-2">
                                        <InputText v-model="institution.zonecode" class="w-32" readonly />
                                        <Button label="우편번호 검색" @click="execDaumPostcode" />
                                    </div>
                                    <InputText v-model="institution.institution_address" readonly />
                                    <InputText v-model="institution.detail_address" placeholder="상세 주소 입력" />
                                </div>
                                <InputText v-else v-model="institution[slotProps.data.field]" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
                <div class="flex justify-end mt-4">
                    <Button label="저장" @click="save"></Button>
                </div>
            </div>
        </div>
    </div>
</template>
