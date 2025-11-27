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

                        <h3 class="text-theme-1 fw-normal mb-0">Create Account</h3>
                        <h1 class="fw-bold text-theme-accent-1 mb-4">Svasthya</h1>

                        <!-- Name -->
                        <div class="form-floating mb-1">
                            <input type="text" class="form-control" :class="{ 'border-danger': errors.name }" id="name"
                                placeholder="Full Name" v-model="name" @input="validateName" />
                            <label for="name">Full Name</label>
                        </div>
                        <p v-if="errors.name" class="text-danger small">{{ errors.name }}</p>

                        <!-- Email -->
                        <div class="form-floating mb-1 mt-3">
                            <input type="text" class="form-control" :class="{ 'border-danger': errors.email }"
                                id="email" placeholder="Email" v-model="email" @input="validateEmail" />
                            <label for="email">Email</label>
                        </div>
                        <p v-if="errors.email" class="text-danger small">{{ errors.email }}</p>

                        <!-- Password -->
                        <div class="position-relative mt-3">
                            <div class="form-floating mb-1">
                                <input :type="showPassword ? 'text' : 'password'" class="form-control"
                                    :class="{ 'border-danger': errors.password }" id="password" placeholder="Password"
                                    v-model="password" @input="validatePassword" />
                                <label for="password">Password</label>
                            </div>

                            <button class="btn btn-square btn-link text-theme-1 position-absolute end-0 top-0 mt-2 me-2"
                                @click="togglePassword">
                                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                            </button>
                        </div>
                        <p v-if="errors.password" class="text-danger small">{{ errors.password }}</p>

                        <!-- Confirm Password -->
                        <div class="form-floating mb-1 mt-3">
                            <input :type="showPassword ? 'text' : 'password'" class="form-control"
                                :class="{ 'border-danger': errors.password_confirmation }" id="password_confirmation"
                                placeholder="Confirm" v-model="password_confirmation"
                                @input="validatePasswordConfirmation" />
                            <label for="password_confirmation">Confirm Password</label>
                        </div>
                        <p v-if="errors.password_confirmation" class="text-danger small">
                            {{ errors.password_confirmation }}
                        </p>

                        <!-- Send OTP button -->
                        <button class="btn btn-lg btn-theme w-100 mb-3 mt-3" @click="sendOtp" v-if="!isLoading">
                            Send OTP
                        </button>

                        <button class="btn btn-lg btn-theme w-100 mb-3" disabled v-else>
                            <div class="spinner-border spinner-border-sm" role="status"></div>
                        </button>

                        <div class="text-center mt-3">
                            <router-link to="/login" class="text-decoration-none">
                                Already have an account?
                                <span class="fw-bold text-secondary">Login</span>
                            </router-link>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    </div>

    <Toast ref="toastRef" />
</template>

<script setup>
import { ref } from "vue";
import axios from "@/api";
import { useRouter } from "vue-router";
import Toast from "@/components/Toast.vue";
import { TOAST_SUCCESS, TOAST_ERROR } from "@/utils/config";

const router = useRouter();

// Redirect if already logged in
if (sessionStorage.getItem("auth-token")) {
    window.location.href = "/#/dashboard";
}

const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const showPassword = ref(false);

const errors = ref({});
const toastRef = ref(null);
const isLoading = ref(false);

// Toggle eye
const togglePassword = () => (showPassword.value = !showPassword.value);

// Validation
const validateName = () => {
    errors.value.name = name.value ? "" : "Full name is required.";
};

const validateEmail = () => {
    if (!email.value) errors.value.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email.value))
        errors.value.email = "Enter a valid email address.";
    else errors.value.email = "";
};

const validatePassword = () => {
    if (!password.value) errors.value.password = "Password is required.";
    else if (password.value.length < 6)
        errors.value.password = "Password must be at least 6 characters.";
    else errors.value.password = "";
};

const validatePasswordConfirmation = () => {
    if (!password_confirmation.value)
        errors.value.password_confirmation = "Confirm your password.";
    else if (password.value !== password_confirmation.value)
        errors.value.password_confirmation = "Passwords do not match.";
    else errors.value.password_confirmation = "";
};

// ⭐ Step-1: Send OTP (Account not created yet)
const sendOtp = async () => {
    validateName();
    validateEmail();
    validatePassword();
    validatePasswordConfirmation();

    if (
        errors.value.name ||
        errors.value.email ||
        errors.value.password ||
        errors.value.password_confirmation
    ) {
        return;
    }

    try {
        isLoading.value = true;

        // Store registration data temporarily
        sessionStorage.setItem("pending-name", name.value);
        sessionStorage.setItem("pending-email", email.value);
        sessionStorage.setItem("pending-password", password.value);
        sessionStorage.setItem("pending-password-confirm", password_confirmation.value);

        await axios.post("/api/send-otp", {
            email: email.value,
        });

        toastRef.value.show("OTP sent successfully!", TOAST_SUCCESS);

        router.push("/otp-verify");

    } catch (error) {
        console.error("OTP error:", error);
        toastRef.value.show("Unable to send OTP. Try again.", TOAST_ERROR);
    } finally {
        isLoading.value = false;
    }
};
</script>
