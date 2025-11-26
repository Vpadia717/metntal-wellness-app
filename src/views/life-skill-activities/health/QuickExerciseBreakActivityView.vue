<template>
  <div class="container py-5">
    <h1 class="text-center mb-3">Healthy Lifestyle — Quick Exercise Break</h1>
    <p class="text-muted text-center mb-4">“Need a boost? Move for 5, recharge for hours.”</p>

    <!-- Stepper / Flow -->
    <div v-if="step === 'intro'" class="text-center">
      <p class="lead">Short, shift-friendly routines to boost circulation and alertness.</p>
      <button class="btn btn-accent mt-3" @click="step = 'choose'">Start Exercise Break</button>
      <button class="btn btn-outline-secondary mt-3 ms-2" @click="quickMove">Quick Move (2 min)</button>
    </div>

    <!-- Choose Routine -->
    <div v-else-if="step === 'choose'">
      <h4 class="mb-3">Choose a routine</h4>
      <div class="list-group mb-3">
        <button
          v-for="r in routines"
          :key="r.id"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
          :class="{ active: selectedRoutine && selectedRoutine.id === r.id }"
          @click="selectRoutine(r)"
        >
          <div>
            <div class="fw-bold">{{ r.title }}</div>
            <small class="text-muted">{{ r.subtitle }}</small>
          </div>
          <small class="badge bg-light text-dark align-self-center">{{ r.length }}</small>
        </button>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-secondary" @click="step = 'intro'">Back</button>
        <button class="btn btn-accent" :disabled="!selectedRoutine" @click="startRoutine">Start Now</button>
      </div>
    </div>

    <!-- Player / Follow -->
    <div v-else-if="step === 'play'">
      <h4 class="mb-3">{{ selectedRoutine.title }}</h4>
      <p class="text-muted">{{ selectedRoutine.subtitle }}</p>

      <div class="card mb-3">
        <div class="ratio ratio-16x9">
          <!-- embed YouTube preview by link (open in new tab for demo) -->
          <iframe
            :src="selectedRoutine.embed"
            title="Routine video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <button class="btn btn-outline-secondary me-2" @click="toggleSound">
            {{ mute ? 'Vibration Mode' : 'Sound On/Off' }}
          </button>
          <button class="btn btn-outline-secondary" @click="lockScreen">Screen Lock</button>
        </div>

        <div>
          <button class="btn btn-outline-secondary me-2" @click="step = 'choose'">Change Routine</button>
          <button class="btn btn-accent" @click="finishRoutine">Finish</button>
        </div>
      </div>

      <small class="text-muted">(Video opens inside player; for demo the iframe uses YouTube embed links.)</small>
    </div>

    <!-- Finish & Reflect -->
    <div v-else-if="step === 'reflect'">
      <h4 class="mb-3">How are you feeling now?</h4>
      <div class="d-flex gap-2 mb-3 flex-wrap">
        <button
          v-for="o in feelings"
          :key="o"
          class="btn"
          :class="selectedFeeling === o ? 'btn-accent' : 'btn-outline-secondary'"
          @click="selectedFeeling = o"
        >
          {{ o }}
        </button>
      </div>

      <textarea v-model="feelNote" class="form-control mb-3" rows="3" placeholder="Optional note (e.g., 'Interrupted halfway')"></textarea>

      <div class="d-flex gap-2">
        <button class="btn btn-secondary" @click="step = 'play'">Back</button>
        <button class="btn btn-accent" :disabled="!selectedFeeling" @click="saveSession">Save & Close</button>
      </div>
    </div>

    <!-- Done / Summary -->
    <div v-else-if="step === 'done'">
      <h4 class="text-success mb-3">Mission Complete</h4>
      <p class="mb-3">Session saved to Activity Log.</p>

      <div class="mb-3">
        <small class="text-muted">Recent sessions</small>
        <ul class="list-group mt-2">
          <li v-for="(s, i) in recentSessions" :key="i" class="list-group-item">
            <div class="d-flex justify-content-between">
              <div>
                <strong>{{ s.routine }}</strong>
                <div class="small text-muted">{{ s.date }}</div>
              </div>
              <div class="text-end">
                <div class="small">{{ s.mood }}</div>
                <div class="small text-muted">{{ s.note }}</div>
              </div>
            </div>
          </li>
          <li v-if="recentSessions.length === 0" class="list-group-item text-muted">No sessions yet</li>
        </ul>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="openLog">View Full Log</button>
        <button class="btn btn-accent" @click="step = 'intro'">Do Another</button>
      </div>
    </div>

    <!-- Simple Modal / Log view -->
    <div v-if="showLog" class="mt-4">
      <h5>Activity Log</h5>
      <div class="list-group mb-3">
        <div v-for="(s, i) in recentSessionsAll" :key="i" class="list-group-item">
          <div class="d-flex justify-content-between">
            <div>
              <strong>{{ s.routine }}</strong>
              <div class="small text-muted">{{ s.date }}</div>
            </div>
            <div class="text-end">
              <div class="small">{{ s.mood }}</div>
              <div class="small text-muted">{{ s.note }}</div>
            </div>
          </div>
        </div>
        <div v-if="recentSessionsAll.length === 0" class="list-group-item text-muted">No sessions logged</div>
      </div>
      <button class="btn btn-outline-secondary" @click="clearLog">Clear Log</button>
      <button class="btn btn-secondary ms-2" @click="showLog = false">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const step = ref('intro')
const routines = [
  {
    id: 1,
    title: 'Stretch & Mobility',
    subtitle: 'Gentle moves to release neck, shoulders and hips. (5 min)',
    length: '5 min',
    embed: 'https://www.youtube.com/embed/ef5c6qI1Cw0', // demo embed
  },
  {
    id: 2,
    title: 'Cardio Burst',
    subtitle: 'Short, slightly intense cardio to wake you up. (10 min)',
    length: '10 min',
    embed: 'https://www.youtube.com/embed/2L2lnxIcNmo',
  },
  {
    id: 3,
    title: 'Movement Reset',
    subtitle: 'Full-body reset (7 min).',
    length: '7 min',
    embed: 'https://www.youtube.com/embed/UBMk30rjy0o',
  },
  {
    id: 4,
    title: 'Chair-Friendly Routine',
    subtitle: 'Seated-friendly moves, patrol-car / desk safe.',
    length: '3-5 min',
    embed: 'https://www.youtube.com/embed/3P7m2O6YVtA',
  },
]

const selectedRoutine = ref(null)
const selectedFeeling = ref('')
const feelNote = ref('')
const mute = ref(false)
const showLog = ref(false)

const feelings = ['Energized', 'Calmer', 'No change', 'Tired but glad I moved']

const selectRoutine = (r) => (selectedRoutine.value = r)
const startRoutine = () => {
  if (!selectedRoutine.value) return
  step.value = 'play'
}
const finishRoutine = () => step.value = 'reflect'
const toggleSound = () => (mute.value = !mute.value)
const lockScreen = () => alert('Screen lock enabled (demo)')

const quickMove = () => {
  // Quick move flow -> save a 2-min session as demo
  const sess = {
    routine: 'Quick Move (2 min)',
    date: new Date().toLocaleString(),
    mood: 'Quick Move',
    note: '',
  }
  pushSession(sess)
  alert('Quick Move saved.')
}

// storage helpers
const STORAGE_KEY = 'quick-exercise-log'
const pushSession = (sess) => {
  const cur = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  cur.unshift(sess)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cur.slice(0, 200)))
}
const recentSessionsAll = computed(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const recentSessions = computed(() => recentSessionsAll.value.slice(0, 3))

const saveSession = () => {
  const sess = {
    routine: selectedRoutine.value ? selectedRoutine.value.title : 'Unknown',
    date: new Date().toLocaleString(),
    mood: selectedFeeling.value,
    note: feelNote.value || ''
  }
  pushSession(sess)
  // track streak (basic): count sessions in last 7 days
  updateStreak()
  selectedFeeling.value = ''
  feelNote.value = ''
  selectedRoutine.value = null
  step.value = 'done'
}

const updateStreak = () => {
  const all = recentSessionsAll.value
  // very simple: count distinct days in last 7 days
  const days = new Set(all.map(s => new Date(s.date).toDateString()))
  localStorage.setItem('exercise-streak', days.size)
}

const openLog = () => (showLog.value = true)
const clearLog = () => {
  if (!confirm('Clear activity log?')) return
  localStorage.removeItem(STORAGE_KEY)
}

</script>

<style scoped>
.btn-accent {
  background-color: #d80621;
  color: white;
  border: none;
}
.btn-accent:hover { background-color: #b6051b; color: #fff; }
.list-group-item.active { background-color: rgba(216,8,33,0.12); border-color: rgba(216,8,33,0.2); }
.card { border-radius: 0.6rem; }
</style>
