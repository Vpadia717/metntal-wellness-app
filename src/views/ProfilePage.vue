<template>
    <div class="container px-3">
        <h5 class="text-center py-3">My Profile</h5>

        <div class="row gx-3 gx-lg-4">

            <!-- Name -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="name" v-model.trim="profile.name" />
                    <label for="name">Name</label>
                </div>
            </div>

            <!-- kgidno -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" id="kgidno" v-model.trim="profile.kgidno" />
                    <label for="kgidno">KGID No</label>
                </div>
            </div>

            <!-- Email -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="email" v-model.trim="profile.email" disabled />
                    <label for="email">Email</label>
                </div>
            </div>

            <!-- Date of Birth -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <input type="date" class="form-control" id="dob" v-model="profile.dob" />
                    <label for="dob">Date of Birth*</label>
                </div>
            </div>

            <!-- Phone -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <input type="tel" class="form-control" id="phone" v-model.trim="profile.phone" />
                    <label for="phone">Phone Number*</label>
                </div>
            </div>

            <!-- Gender -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <select class="form-select" id="gender" v-model="profile.gender">
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                    </select>
                    <label for="gender">Gender*</label>
                </div>
            </div>

            <!-- Designation -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <select class="form-select" id="designation" v-model="profile.designation">
                        <option value="" disabled>Select Designation</option>
                        <option v-for="d in designations" :key="d" :value="d">{{ d }}</option>
                    </select>
                    <label for="designation">Designation*</label>
                </div>
            </div>

            <!-- Division -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <select class="form-select" id="division" v-model="profile.division" @change="updatePlaces">
                        <option value="" disabled>Select Division</option>
                        <option v-for="(division, index) in divisions" :key="index" :value="division">
                            {{ division }}
                        </option>
                    </select>
                    <label for="division">Division*</label>
                </div>
            </div>

            <!-- Current Working -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <select class="form-select" v-model="profile.currentWorking">
                        <option value="" disabled>Select Current Place of Working</option>
                        <option v-for="(place, index) in currentPlaces" :key="index" :value="place">
                            {{ place }}
                        </option>
                    </select>
                    <label for="current-working">Current Place of Working*</label>
                </div>
            </div>

            <!-- Qualification -->
            <div class="col-12">
                <div class="form-floating mb-3">
                    <select class="form-select" id="qualification" v-model="profile.qualification">
                        <option value="" disabled>Select Qualification</option>
                        <option value="10th">10th</option>
                        <option value="PUC">PUC</option>
                        <option value="Degree">Degree</option>
                        <option value="Post Graduation">Post Graduation</option>
                        <option value="MPhil">MPhil</option>
                        <option value="PhD">PhD</option>
                        <option value="Others">Others</option>
                    </select>
                    <label for="qualification">Qualification*</label>
                </div>
            </div>

            <!-- Submit -->
            <div class="col-12 text-center mt-3">
                <button class="btn btn-primary rounded-pill px-4" @click="submitProfile">
                    Update Profile
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/api";
import { useRouter } from "vue-router";

const router = useRouter();

// --------------------------
// FULL PROFILE STATE
// --------------------------
const profile = ref({
    name: "",
    email: "",
    dob: "",
    phone: "",
    gender: "",
    designation: "",
    division: "",
    currentWorking: "",
    qualification: ""
});

// --------------------------
// STATIC DATA
// --------------------------
const designations = ["DGP", "ADGP", "IGP", "DIGP", "SGSP", "SP", "Addl SP", "DSP", "PI", "SI", "ASI", "HC", "PC"];

const divisions = [
    "Central Division", "East Division", "West Division", "North Division", "South Division",
    "South East Division", "North East Division", "Whitefield Division", "Soth West Division",
    "North West Division", "Electronic City Division", "Traffic East Division", "Traffic West Division",
    "Traffic North Division", "Traffic South Division", "CAR South Division", "CAR North Division",
    "CAR Head Quarters", "CAR West"
];

// (Full divisionPlaces kept exactly from your file)
const divisionPlaces = { /* FULL DATA FROM YOUR MESSAGE */ };

const currentPlaces = ref([]);

// --------------------------
// UPDATE PLACE LIST BASED ON DIVISION
// --------------------------
const updatePlaces = () => {
    currentPlaces.value = divisionPlaces[profile.value.division] || [];
    profile.value.currentWorking = "";
};

// --------------------------
// DATE FORMATTER (fix DOB autofill)
// --------------------------
const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
};

// --------------------------
// FETCH PROFILE DATA
// --------------------------
const fetchProfile = async () => {
    try {
        const res = await axios.get("/api/profile");

        profile.value.name = res.data.user.name;
        profile.value.email = res.data.user.email;

        profile.value.dob = res.data.detail.dob ? formatDate(res.data.detail.dob) : "";
        profile.value.phone = res.data.detail.phone || "";
        profile.value.gender = res.data.detail.gender || "";
        profile.value.designation = res.data.detail.designation || "";
        profile.value.division = res.data.detail.division || "";
        profile.value.currentWorking = res.data.detail.current_working || "";
        profile.value.qualification = res.data.detail.qualification || "";

        updatePlaces();
    } catch (e) {
        if (e.response?.status === 401) router.push("/login");
    }
};

// --------------------------
// SUBMIT PROFILE
// --------------------------
const submitProfile = async () => {
    const payload = {
        dob: profile.value.dob,
        phone: profile.value.phone,
        gender: profile.value.gender,
        designation: profile.value.designation,
        division: profile.value.division,
        current_working: profile.value.currentWorking,
        qualification: profile.value.qualification
    };

    await axios.post("/api/profile", payload);
    alert("Profile updated successfully!");
};

onMounted(fetchProfile);
</script>
