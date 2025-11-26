<template>
    <div class="container px-3">
        <h5 class="text-center py-3">My Profile</h5>

        <div class="row gx-3 gx-lg-4">

            <!-- NAME -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <input type="text" class="form-control" :class="{ 'border-danger': errors.name }" id="name"
                        v-model.trim="profile.name" @input="validateName" />
                    <label for="name">Name</label>
                </div>
                <p v-if="errors.name" class="text-danger small">{{ errors.name }}</p>
            </div>

            <!-- EMAIL -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <input type="email" class="form-control" :class="{ 'border-danger': errors.email }" id="email"
                        v-model.trim="profile.email" @input="validateEmail" />
                    <label for="email">Email*</label>
                </div>
                <p v-if="errors.email" class="text-danger small">{{ errors.email }}</p>
            </div>

            <!-- PASSWORD (optional) -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <input type="password" class="form-control" :class="{ 'border-danger': errors.password }"
                        id="password" v-model.trim="profile.password" @input="validatePassword" />
                    <label for="password">New Password (optional)</label>
                </div>
                <p v-if="errors.password" class="text-danger small">{{ errors.password }}</p>
            </div>

            <!-- DOB -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <input type="date" class="form-control" :class="{ 'border-danger': errors.dob }" id="dob"
                        v-model="profile.dob" @input="validateDob" />
                    <label for="dob">Date of Birth*</label>
                </div>
                <p v-if="errors.dob" class="text-danger small">{{ errors.dob }}</p>
            </div>

            <!-- PHONE -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <input type="tel" class="form-control" :class="{ 'border-danger': errors.phone }" id="phone"
                        v-model.trim="profile.phone" @input="validatePhone" />
                    <label for="phone">Phone Number*</label>
                </div>
                <p v-if="errors.phone" class="text-danger small">{{ errors.phone }}</p>
            </div>

            <!-- GENDER -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <select class="form-select" :class="{ 'border-danger': errors.gender }" id="gender"
                        v-model="profile.gender" @change="validateGender">
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                    </select>
                    <label for="gender">Gender*</label>
                </div>
                <p v-if="errors.gender" class="text-danger small">{{ errors.gender }}</p>
            </div>

            <!-- DESIGNATION -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <select class="form-select" :class="{ 'border-danger': errors.designation }" id="designation"
                        v-model="profile.designation" @change="validateDesignation">
                        <option value="" disabled>Select Designation</option>
                        <option v-for="d in designations" :key="d" :value="d">{{ d }}</option>
                    </select>
                    <label for="designation">Designation*</label>
                </div>
                <p v-if="errors.designation" class="text-danger small">{{ errors.designation }}</p>
            </div>

            <!-- DIVISION -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <select class="form-select" :class="{ 'border-danger': errors.division }" id="division"
                        v-model="profile.division" @change="updatePlaces(); validateDivision();">
                        <option value="" disabled>Select Division</option>
                        <option v-for="div in divisions" :key="div" :value="div">{{ div }}</option>
                    </select>
                    <label for="division">Division*</label>
                </div>
                <p v-if="errors.division" class="text-danger small">{{ errors.division }}</p>
            </div>

            <!-- CURRENT WORKING -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <select class="form-select" :class="{ 'border-danger': errors.currentWorking }"
                        v-model="profile.currentWorking" @change="validateCurrentWorking">
                        <option value="" disabled>Select Current Place of Working</option>
                        <option v-for="place in currentPlaces" :key="place" :value="place">
                            {{ place }}
                        </option>
                    </select>
                    <label>Current Place of Working*</label>
                </div>
                <p v-if="errors.currentWorking" class="text-danger small">
                    {{ errors.currentWorking }}
                </p>
            </div>

            <!-- QUALIFICATION -->
            <div class="col-12">
                <div class="form-floating mb-1">
                    <select class="form-select" :class="{ 'border-danger': errors.qualification }" id="qualification"
                        v-model="profile.qualification" @change="validateQualification">
                        <option value="" disabled>Select Qualification</option>
                        <option v-for="q in qualifications" :key="q" :value="q">{{ q }}</option>
                    </select>
                    <label for="qualification">Qualification*</label>
                </div>
                <p v-if="errors.qualification" class="text-danger small">
                    {{ errors.qualification }}
                </p>
            </div>

            <!-- SUBMIT -->
            <div class="col-12 text-center mt-3">
                <button class="btn btn-primary rounded-pill px-4" @click="submitProfile">
                    Update Profile
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import axios from "@/api";
import { useRouter } from "vue-router";

const router = useRouter();

// --------------------------
// STATE
// --------------------------
const profile = reactive({
    name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
    gender: "",
    designation: "",
    division: "",
    currentWorking: "",
    qualification: "",
});

const errors = reactive({});

// --------------------------
// STATIC LIST DATA
// --------------------------
const designations = ["DGP", "ADGP", "IGP", "DIGP", "SGSP", "SP", "Addl SP", "DSP", "PI", "SI", "ASI", "HC", "PC"];
const qualifications = ["10th", "PUC", "Degree", "Post Graduation", "MPhil", "PhD", "Others"];
const divisions = [/* same as earlier */];
const divisionPlaces = { /* same as earlier */ };
const currentPlaces = ref([]);

// --------------------------
// UPDATE PLACES
// --------------------------
const updatePlaces = () => {
    currentPlaces.value = divisionPlaces[profile.division] || [];
    if (!currentPlaces.value.includes(profile.currentWorking)) {
        profile.currentWorking = "";
    }
};

// --------------------------
// REAL-TIME VALIDATION
// --------------------------
const validateName = () => {
    errors.name = profile.name ? "" : "Name is required.";
};

const validateEmail = () => {
    if (!profile.email) errors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(profile.email))
        errors.email = "Invalid email format.";
    else errors.email = "";
};

const validatePassword = () => {
    if (!profile.password) {
        errors.password = "";
        return;
    }
    if (profile.password.length < 6)
        errors.password = "Password must be at least 6 characters.";
    else errors.password = "";
};

const validateDob = () => {
    errors.dob = profile.dob ? "" : "DOB is required.";
};

const validatePhone = () => {
    if (!profile.phone) errors.phone = "Phone is required.";
    else if (!/^[0-9]{10}$/.test(profile.phone))
        errors.phone = "Phone must be exactly 10 digits.";
    else errors.phone = "";
};

const validateGender = () => {
    errors.gender = profile.gender ? "" : "Gender is required.";
};

const validateDesignation = () => {
    errors.designation = profile.designation ? "" : "Designation is required.";
};

const validateDivision = () => {
    errors.division = profile.division ? "" : "Division is required.";
};

const validateCurrentWorking = () => {
    errors.currentWorking = profile.currentWorking ? "" : "Current working place is required.";
};

const validateQualification = () => {
    errors.qualification = profile.qualification ? "" : "Qualification is required.";
};

// --------------------------
// FETCH PROFILE
// --------------------------
const fetchProfile = async () => {
    try {
        const res = await axios.get("/api/profile");
        Object.assign(profile, res.data.detail);
        updatePlaces();
    } catch (e) {
        if (e.response?.status === 401) router.push("/login");
    }
};

// --------------------------
// SUBMIT
// --------------------------
const submitProfile = async () => {
    // Trigger full validation once
    validateName();
    validateEmail();
    validatePassword();
    validateDob();
    validatePhone();
    validateGender();
    validateDesignation();
    validateDivision();
    validateCurrentWorking();
    validateQualification();

    if (Object.values(errors).some((e) => e)) return;

    const payload = { ...profile };
    if (!profile.password) delete payload.password;

    await axios.post("/api/profile", payload);

    alert("Profile updated successfully");
};

onMounted(fetchProfile);
</script>

<style scoped>
.small {
    font-size: 13px;
}

.text-danger {
    margin-top: -5px;
}
</style>
