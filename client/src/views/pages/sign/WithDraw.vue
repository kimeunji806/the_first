<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import logoImage from '@/assets/logo/logo2.png';

const router = useRouter();

const withdrawForm = ref({
    email: '',
    auth_code: ''
});

const isVerified = ref(false);

// 타이머 설정
const timer = ref(180);
let interval = null;
const isExpired = ref(false);

// 이메일 변경 시 상태 초기화
watch(
    () => withdrawForm.value.email,
    () => {
        isVerified.value = false;
        withdrawForm.value.auth_code = '';
        isExpired.value = false;
        clearInterval(interval);
    }
);

const startTimer = () => {
    timer.value = 180;
    isExpired.value = false;
    clearInterval(interval);
    interval = setInterval(() => {
        if (timer.value > 0) timer.value--;
        else {
            clearInterval(interval);
            isExpired.value = true;
            alert('인증시간이 만료되었습니다.');
        }
    }, 1000);
};

onUnmounted(() => clearInterval(interval));

const formatTime = computed(() => {
    const min = String(Math.floor(timer.value / 60)).padStart(2, '0');
    const sec = String(timer.value % 60).padStart(2, '0');
    return `${min}:${sec}`;
});

// 인증번호 발송
const sendCode = async () => {
    if (!withdrawForm.value.email) {
        alert('이메일을 입력해주세요.');
        return;
    }
    try {
        const res = await fetch('/api/mail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: withdrawForm.value.email })
        });
        if (res.ok) {
            isVerified.value = false;
            startTimer();
            alert('인증번호가 발송되었습니다.');
        }
    } catch (err) {
        console.log(err);
    }
};

// 인증번호 확인
const verifyCode = async () => {
    if (!withdrawForm.value.auth_code) {
        alert('인증번호를 입력해주세요.');
        return;
    }
    try {
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_email: withdrawForm.value.email,
                code: withdrawForm.value.auth_code
            })
        });
        const data = await res.json();
        if (data.retCode === true) {
            isVerified.value = true;
            clearInterval(interval);
            alert('인증되었습니다.');
        } else {
            alert('인증번호가 올바르지 않습니다.');
        }
    } catch (err) {
        console.log(err);
    }
};

// 회원 탈퇴 실행
const handleWithdraw = async () => {
    if (!isVerified.value) {
        alert('이메일 인증을 완료해주세요.');
        return;
    }
    if (confirm('정말로 탈퇴하시겠습니까? 탈퇴 후 데이터 복구는 불가능합니다.')) {
        try {
            const res = await fetch('/api/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: withdrawForm.value.email })
            });
            if (res.ok) {
                alert('탈퇴 처리가 완료되었습니다.');
                router.push('/sign/login');
            }
        } catch (err) {
            alert('탈퇴 처리 중 오류가 발생했습니다.');
        }
    }
};
</script>
<template>
    <div class="flex h-screen m-0">
        <!-- 왼쪽 로고 영역 -->
        <div class="flex-1 flex flex-col items-center justify-center bg-yellow-50">
            <img :src="logoImage" alt="Logo" class="w-72 max-w-4/5 object-contain" />
        </div>

        <!-- 오른쪽 회원탈퇴 폼 -->
        <div class="flex-1 flex items-center justify-center bg-white">
            <div class="w-96 xl:w-[480px] flex flex-col gap-6 p-8 rounded-lg">
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-surface-800 mb-2">회원탈퇴</h2>
                    <p class="text-red-500 text-lg font-medium">회원탈퇴시 지원건에 대한 책임은 개인에게 있습니다.</p>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold text-surface-700">이메일</label>
                    <InputGroup>
                        <InputText v-model="withdrawForm.email" placeholder="이메일을 입력하세요" :disabled="isVerified" />
                        <Button :label="isExpired ? '재발송' : '인증하기'" severity="success" class="auth-btn" @click="sendCode" :disabled="isVerified" />
                    </InputGroup>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold text-surface-700">인증번호</label>
                    <InputGroup>
                        <InputText v-model="withdrawForm.auth_code" placeholder="인증번호 입력" :disabled="isVerified" />
                        <InputGroupAddon v-if="!isVerified" class="timer-text">
                            {{ formatTime }}
                        </InputGroupAddon>
                        <Button label="확인" severity="success" class="auth-btn" @click="verifyCode" :disabled="isVerified" />
                    </InputGroup>
                    <p v-if="isVerified" class="text-blue-500 text-xs mt-1">* 인증이 완료되었습니다.</p>
                    <p v-else class="text-red-500 text-xs mt-1">* 이메일 인증을 진행해주세요.</p>
                </div>
                <Button label="확인" severity="success" size="large" fluid class="font-bold mt-4" :disabled="!isVerified" @click="handleWithdraw" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-btn {
    width: 90px !important;
    font-size: 0.9rem;
}
.timer-text {
    background: transparent !important;
    color: #22c55e;
    font-weight: bold;
    min-width: 60px;
}
/* PrimeVue InputGroup 스타일 미세 조정 */
:deep(.p-inputgroup .p-inputtext) {
    border-right: none;
}
:deep(.p-inputgroup .p-button) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>
