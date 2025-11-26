<template>
    <div class="container py-4">

        <!-- Quotes -->
        <div class="card mb-3">
            <div class="px-2 theme-red">
                <button class="btn btn-outline-accent my-1 w-100 bg-theme-l-gradient-light">
                    <div class="row">
                        <div class="col text-start">🌞</div>
                        <div class="col text-center">Daily Affirmation</div>
                        <div class="col text-end"></div>
                    </div>
                </button>
            </div>

            <div id="healthTipsCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
                <div class="carousel-inner">
                    <div v-for="(tip, index) in healthTips" :key="index"
                        :class="['carousel-item', { active: index === 0 }]">
                        <div class="d-flex justify-content-center align-items-center">
                            <div class="text-center">
                                <p class="lead">{{ tip }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Greeting -->
        <h4 class="mb-4 ps-2">Hi {{ currentUser }}, {{ greeting }}</h4>

        <!-- ⭐ Mood Tracker -->
        <div class="card p-3 mb-4">
            <h5>How are you feeling today?</h5>

            <div class="row mt-3">
                <div class="col-4 col-md-2 col-lg-2 text-center mb-3" v-for="(mood, index) in moods" :key="index"
                    @click="selectedMood = mood.label"
                    :class="selectedMood === mood.label ? 'fw-bold text-danger' : 'text-secondary'"
                    style="cursor: pointer;">
                    <img :src="mood.src" class="mood-icon mb-1" />
                    <div class="small">{{ mood.label }}</div>
                </div>
            </div>

            <textarea class="w-100 ps-3 rounded" placeholder="Describe your mood" cols="3"></textarea>

            <button class="btn btn-danger w-100 mt-1">Save Mood</button>
        </div>

        <!-- Intro Video -->
        <h5 class="mb-3 text-center">Intro about <strong>Svasthya</strong></h5>

        <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/N_28cfeGeQM?si=OwnoXY8Y_bGTZI_-"
                frameborder="0" allowfullscreen></iframe>
        </div>

        <div class="mb-3 mt-3">
            <img src="/images/dailyselfcheck.png" class="img-fluid contain" />
        </div>

        <!-- Progress Section -->
        <div class="mb-4 ps-2 mt-3">
            <div class="row g-3 mt-2">
                <div class="col-6 text-center">
                    <div class="border rounded p-4 hover-box" @click="router.push('/physical/qna')">
                        Physical Assessment
                    </div>
                    <div class="video-container mt-3 rounded">
                        <iframe width="560" height="315"
                            src="https://www.youtube.com/embed/5Be62_oZjyo?si=JPlMPxxkTBYnKtxV" frameborder="0"
                            allowfullscreen></iframe>
                    </div>
                    <div class="card audio-card mt-3 text-center">
                        <i class="bi bi-mic fs-4 mb-1"></i>
                        <audio controls class="w-100">
                            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                                type="audio/mpeg" />
                        </audio>
                    </div>
                </div>

                <div class="col-6 text-center">
                    <div class="border rounded p-4 hover-box" @click="router.push('/mental/qna')">
                        Mental Health Assessment
                    </div>
                    <div class="video-container mt-3 rounded">
                        <iframe width="560" height="315"
                            src="https://www.youtube.com/embed/IyqLDC4US6Y?si=JxfAOoLMtt8YPezP" frameborder="0"
                            allowfullscreen></iframe>
                    </div>
                    <div class="card audio-card mt-3 text-center">
                        <i class="bi bi-mic fs-4 mb-1"></i>
                        <audio controls class="w-100">
                            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                                type="audio/mpeg" />
                        </audio>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Activities -->
        <div class="mb-4 ps-2">
            <h5>Quick activities</h5>
            <div class="row g-3 mt-2">
                <div v-for="(activity, index) in activities" :key="index" class="col-12">
                    <div class="border rounded p-2 h-100 d-flex flex-column justify-content-between"
                        @click="navigateTo(activity.path)" style="cursor: pointer;">
                        <div>
                            <i :class="['fa-2x mb-1', activity.icon]"></i>
                            {{ activity.title }}
                        </div>
                        <small class="text-muted">{{ activity.duration }}</small>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "@/api";
import { useRouter } from "vue-router";

const router = useRouter();

// ✔ FETCH USER NAME
const currentUser = ref("");

const fetchUser = async () => {
    try {
        const response = await axios.get("/api/me");
        currentUser.value = response.data.user.name;
    } catch (error) {
        console.log("Error fetching user:", error);
        // Auto logout if token is invalid
        if (error.response?.status === 401) {
            sessionStorage.clear();
            router.push("/login");
        }
    }
};

fetchUser(); // Load user on mount

// Mood Tracker
const selectedMood = ref(null);

const moods = [
    { label: "HAPPY", src: "/images/moods/HAPPY.png" },
    { label: "ANGRY", src: "/images/moods/ANGRY.png" },
    { label: "CONFUSED", src: "/images/moods/CONFUSED.png" },
    { label: "LOVED", src: "/images/moods/LOVED.png" },
    { label: "DISGUSTED", src: "/images/moods/DISGUSTED.png" },
    { label: "ANXIOUS", src: "/images/moods/ANXIOUS.png" },
    { label: "SICK", src: "/images/moods/SICK.png" },
    { label: "FUNNY", src: "/images/moods/FUNNY.png" },
    { label: "LONELY", src: "/images/moods/LONELY.png" },
    { label: "DISAPPOINTED", src: "/images/moods/DISAPPOINTED.png" },
    { label: "SAD", src: "/images/moods/SAD.png" },
    { label: "WORRIED", src: "/images/moods/WORRIED.png" },
    { label: "EXCITED", src: "/images/moods/EXCITED.png" },
    { label: "ANNOYED", src: "/images/moods/ANNOYED.png" },
    { label: "AFRAID", src: "/images/moods/AFRAID.png" },
    { label: "TIRED", src: "/images/moods/TIRED.png" },
    { label: "NERVOUS", src: "/images/moods/NERVOUS.png" },
    { label: "AMAZED", src: "/images/moods/AMAZED.png" },
    { label: "SILLY", src: "/images/moods/SILLY.png" },
    { label: "STRESSED", src: "/images/moods/STRESSED.png" },
    { label: "EMBARRASSED", src: "/images/moods/EMBARRASSED.png" },
    { label: "JEALOUS", src: "/images/moods/JEALOUS.png" },
    { label: "FRUSTRATED", src: "/images/moods/FRUSTRATED.png" },
    { label: "SCARED", src: "/images/moods/SCARED.png" },
    { label: "SURPRISED", src: "/images/moods/SURPRISED.png" },
    { label: "INSECURE", src: "/images/moods/INSECURE.png" },
    { label: "HURT", src: "/images/moods/HURT.png" },
    { label: "CONTENT", src: "/images/moods/CONTENT.png" },
    { label: "MAD", src: "/images/moods/MAD.png" },
    { label: "THANKFUL", src: "/images/moods/THANKFUL.png" }
];

const healthTips = ref([
    "Strength is not in shouting louder - it's in staying calmer.",
    "Drink at least 8 glasses of water a day.",
    "Take a 10-minute walk after meals to aid digestion.",
    "Get 7-8 hours of sleep every night.",
    "Include fruits and vegetables in every meal.",
    "Avoid screen time 30 minutes before bed.",
    "Stretch every morning to improve flexibility.",
    "Practice mindful breathing for stress relief."
]);

const activities = [
    { title: 'Anger Thermometer & Punch Pillow', duration: '2 min', icon: 'bi bi-soundwave', path: '/activity/anger-thermometer' },
    { title: 'THE FORK IN THE ROAD ACTIVITY', duration: '5 min', icon: 'bi bi-sign-railroad', path: '/' },
    { title: 'Micro Goal Tracking', duration: '5 min', icon: 'bi bi-bullseye', path: '/' },
];

function navigateTo(path) {
    router.push(path);
}

const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
});
</script>

<style scoped>
.mood-icon {
    width: 60px;
    height: 60px;
    object-fit: contain;
}

.video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    height: 0;
}

.video-container iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.hover-box {
    transition: background-color 0.3s ease;
}

.hover-box:hover {
    background-color: #A7C1A8;
}
</style>
