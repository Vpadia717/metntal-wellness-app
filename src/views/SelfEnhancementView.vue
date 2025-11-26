<template>
    <div class="container py-5">
        <h1 class="mb-4 text-center">Self Enhancement Activities</h1>

        <div class="row g-3 justify-content-center">
            <div class="col-12 col-md-4" v-for="activity in activities" :key="activity.id">
                <button 
                    class="btn btn-accent w-100"
                    @click="goToActivity(activity.route)"
                >
                    {{ activity.title }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const activities = [
    { id: 1, title: 'RESILIENCE', route: '/self-enhancement/resilience' },
    { id: 2, title: 'DECISION MAKING', route: '/self-enhancement/decision-making' },
    { id: 3, title: 'CRITICAL THINKING', route: '/self-enhancement/critical-thinking' },
    { id: 4, title: 'CREATIVE THINKING', route: '/self-enhancement/creative-thinking' },
    { id: 5, title: 'EMPATHY', route: '/self-enhancement/empathy' },
    { id: 5, title: 'PROBLEM SOLVING', route: '/self-enhancement/problem-solving' },
    // { id: 6, title: 'SELF-DISCIPLINE', route: '/activity' },
    { id: 7, title: 'SELF AWARENESS', route: '/self-enhancement/self-awareness' },
    { id: 8, title: 'SLEEP HYGIENE', route: '/self-enhancement/sleep-hygiene' },
    { id: 9, title: 'ANGER MANAGEMENT', route: '/self-enhancement/anger-management' },
    { id: 10, title: 'SELF INSIGHT', route: '/self-enhancement/self-insight' },
    // { id: 11, title: 'LIFE SKILLS', route: '/self-enhancement/life-skills' },
    // { id: 12, title: 'SELF ENHANCEMENT', route: '/activity' },
]

const goToActivity = (route) => {
    router.push(route)
}
</script>

<style scoped>
h1 {
    font-weight: 700;
    letter-spacing: 1px;
}

.btn {
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 0.5rem;
    transition: transform 0.2s;
}

.btn:hover {
    transform: scale(1.05);
}
</style>
