<template>
    <header class="adminuiux-header">
        <nav class="navbar">
            <div class="container-fluid">
                <div class="ms-auto"></div>
            </div>
        </nav>
    </header>

    <div class="adminuiux-wrap z-index-0 position-relative">
        <main class="adminuiux-content">
            <div class="container-fluid">
                <div class="row gx-3 align-items-center justify-content-center py-3 mt-auto height-dynamic"
                    style="--h-dynamic: calc(100vh - 120px)">
                    <div class="col login-box maxwidth-400">

                        <h3 class="text-theme-1 fw-normal mb-0">Verify OTP</h3>
                        <h1 class="fw-bold text-theme-accent-1 mb-4">Svasthya</h1>

                        <p class="small text-secondary mb-4">
                            A 6-digit OTP has been sent to<br>
                            <strong>{{ email }}</strong>
                        </p>

                        <!-- OTP Inputs -->
                        <div class="d-flex justify-content-between mb-2">
                            <input v-for="(_, index) in otpInputs" :key="index" type="text" maxlength="1"
                                class="form-control text-center otp-box" :class="{ 'border-danger': errors.otp }"
                                v-model="otpInputs[index]" @input="handleInput(index)"
                                @keydown.backspace.prevent="handleBackspace(index)" />
                        </div>

                        <p v-if="errors.otp" class="text-danger small text-center">{{ errors.otp }}</p>

                        <!-- Verify -->
                        <button class="btn btn-lg btn-theme w-100 mt-3" @click="verifyOtp" v-if="!isLoading">
                            Verify OTP
                        </button>

                        <button class="btn btn-lg btn-theme w-100 mt-3" disabled v-else>
                            <div class="spinner-border spinner-border-sm"></div>
                        </button>

                        <!-- Resend -->
                        <div class="text-center mt-3">
                            <button class="btn btn-link p-0" :disabled="timer > 0" @click="resendOtp">
                                <span v-if="timer === 0">Resend OTP</span>
                                <span v-else>Resend in {{ timer }}s</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    </div>

    <Toast ref="toastRef" />
</template>

<style>
.otp-box {
    width: 48px;
    height: 48px;
    font-size: 20px;
    font-weight: bold;
    border-radius: 8px;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/api";
import { useRouter } from "vue-router";
import Toast from "@/components/Toast.vue";
import { TOAST_ERROR, TOAST_SUCCESS } from "@/utils/config";

const router = useRouter();

const email = sessionStorage.getItem("pending-email");
const name = sessionStorage.getItem("pending-name");
const password = sessionStorage.getItem("pending-password");
const password_confirmation = sessionStorage.getItem("pending-password-confirm");

if (!email || !password) router.push("/register");

const otpInputs = ref(["", "", "", "", "", ""]);
const errors = ref({});
const isLoading = ref(false);
const timer = ref(30);
const toastRef = ref(null);

// Auto focus
onMounted(() => {
    startTimer();
    document.querySelector(".otp-box")?.focus();
});

const handleInput = (index) => {
    const value = otpInputs.value[index];

    if (!/^\d$/.test(value)) {
        otpInputs.value[index] = "";
        return;
    }
    if (index < 5) {
        document.querySelectorAll(".otp-box")[index + 1].focus();
    }
    validateOtp();
};

const handleBackspace = (index) => {
    if (otpInputs.value[index] === "") {
        if (index > 0) {
            document.querySelectorAll(".otp-box")[index - 1].focus();
            otpInputs.value[index - 1] = "";
        }
    } else {
        otpInputs.value[index] = "";
    }
    validateOtp();
};

const validateOtp = () => {
    if (otpInputs.value.join("").length < 6) {
        errors.value.otp = "Enter the full 6-digit OTP.";
    } else {
        errors.value.otp = "";
    }
};

const verifyOtp = async () => {
    validateOtp();
    if (errors.value.otp) return;

    try {
        isLoading.value = true;

        // Step 1 – Verify OTP
        await axios.post("/api/verify-otp", {
            email,
            otp: otpInputs.value.join("")
        });

        toastRef.value.show("OTP Verified!", TOAST_SUCCESS);

        // Step 2 – Auto Register User
        const registerRes = await axios.post("/api/register", {
            name,
            email,
            password,
            password_confirmation
        });

        // Step 3 – Store token
        sessionStorage.setItem("auth-token", registerRes.data.token);
        sessionStorage.setItem("user-id", registerRes.data.user.id);
        sessionStorage.setItem("user-name", registerRes.data.user.name);
        sessionStorage.setItem("user-email", registerRes.data.user.email);

        // Clean pending data
        sessionStorage.removeItem("pending-name");
        sessionStorage.removeItem("pending-email");
        sessionStorage.removeItem("pending-password");
        sessionStorage.removeItem("pending-password-confirm");

        router.push("/profile");

    } catch (error) {
        toastRef.value.show("Invalid or expired OTP.", TOAST_ERROR);
    } finally {
        isLoading.value = false;
    }
};

const resendOtp = async () => {
    try {
        await axios.post("/api/send-otp", { email });
        toastRef.value.show("OTP Resent!", TOAST_SUCCESS);
        resetInputs();
        startTimer();
    } catch {
        toastRef.value.show("Failed to resend OTP.", TOAST_ERROR);
    }
};

const startTimer = () => {
    timer.value = 30;
    const countdown = setInterval(() => {
        if (timer.value > 0) timer.value--;
        else clearInterval(countdown);
    }, 1000);
};

const resetInputs = () => {
    otpInputs.value = ["", "", "", "", "", ""];
    document.querySelector(".otp-box")?.focus();
};
</script>
