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
        <div class="row gx-3 align-items-center justify-content-center py-3 mt-auto z-index-1 height-dynamic"
          style="--h-dynamic: calc(100vh - 120px)">
          <div class="col login-box maxwidth-400">

            <!-- heading -->
            <div class="mb-4">
              <h3 class="text-theme-1 fw-normal mb-0">Welcome to,</h3>
              <h1 class="fw-bold text-theme-accent-1 mb-0">Svasthya</h1>
            </div>

            <!-- email -->
            <div class="form-floating mb-1">
              <input type="text" class="form-control" :class="{ 'border-danger': errors.email }" id="email"
                placeholder="Email" v-model="email" @input="validateEmail" />
              <label for="email">Email</label>
            </div>
            <p v-if="errors.email" class="text-danger small">{{ errors.email }}</p>

            <!-- password -->
            <div class="position-relative mt-3">
              <div class="form-floating mb-1">
                <input :type="showPassword ? 'text' : 'password'" class="form-control"
                  :class="{ 'border-danger': errors.password }" id="password" placeholder="Password" v-model="password"
                  @input="validatePassword" />
                <label for="password">Password</label>
              </div>

              <button type="button" class="btn btn-square btn-link text-theme-1 position-absolute end-0 top-0 mt-2 me-2"
                @click="togglePassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <p v-if="errors.password" class="text-danger small">{{ errors.password }}</p>

            <!-- remember + forgot -->
            <div class="row gx-3 align-items-center mb-3 mt-3">
              <div class="col">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="rememberme" />
                  <label class="form-check-label" for="rememberme">Remember me</label>
                </div>
              </div>
              <div class="col-auto">
                <router-link to="/forgot-password">Forgot Password?</router-link>
              </div>
            </div>

            <!-- login button -->
            <button class="btn btn-lg btn-theme w-100 mb-3" @click="login" v-if="!isLoading">
              Login
            </button>

            <button class="btn btn-lg btn-theme w-100 mb-3" disabled v-else>
              <div class="spinner-border spinner-border-sm" role="status"></div>
            </button>

            <!-- register -->
            <div class="text-center mt-3">
              <router-link to="/register" class="text-decoration-none">
                Don't have an account?
                <span class="fw-bold text-secondary">Register</span>
              </router-link>
            </div>

          </div>
        </div>
      </div>
    </main>
  </div>

  <footer class="adminuiux-footer mt-auto">
    <div class="container-fluid text-center"></div>
  </footer>

  <Toast ref="toastRef" />
</template>

<script setup>
import { ref } from "vue";
import axios from "@/api";
import { useRouter } from "vue-router";
import Toast from "@/components/Toast.vue";
import { TOAST_SUCCESS, TOAST_ERROR } from "@/utils/config";

const router = useRouter();

// 🚀 Auto redirect if already logged in
if (sessionStorage.getItem("auth-token")) {
  window.location.href = "http://localhost:5173/#/dashboard";
}

// state
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errors = ref({});
const toastRef = ref(null);
const isLoading = ref(false);

// toggle visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// validation
const validateEmail = () => {
  if (!email.value) errors.value.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(email.value))
    errors.value.email = "Please enter a valid email.";
  else errors.value.email = "";
};

const validatePassword = () => {
  if (!password.value) errors.value.password = "Password is required.";
  else if (password.value.length < 6)
    errors.value.password = "Password must be at least 6 characters.";
  else errors.value.password = "";
};

// login api
const login = async () => {
  validateEmail();
  validatePassword();

  if (errors.value.email || errors.value.password) return;

  try {
    isLoading.value = true;

    const response = await axios.post("/api/login", {
      email: email.value,
      password: password.value,
    });

    toastRef.value.show("Logged in successfully!", TOAST_SUCCESS);

    // store token
    sessionStorage.setItem("auth-token", response.data.token);

    // store user
    sessionStorage.setItem("user-id", response.data.user.id);
    sessionStorage.setItem("user-name", response.data.user.name);
    sessionStorage.setItem("user-email", response.data.user.email);

    setTimeout(() => {
      router.push("/dashboard");
    }, 500);

  } catch (error) {
    console.error("Login error:", error);

    if (error.response?.status === 401) {
      toastRef.value.show("Incorrect email or password.", TOAST_ERROR);
    } else {
      toastRef.value.show("Unable to login. Try again.", TOAST_ERROR);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
