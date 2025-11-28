<template>
	<!-- bottom navigation bar starts -->
	<footer ref="bottomNavigationBarRef" class="adminuiux-mobile-footer hide-on-scrolldown style-1">
		<div class="container">
			<ul class="nav nav-pills nav-justified">
				<li class="nav-item">
					<router-link to="/dashboard" class="nav-link">
						<span><i class="nav-icon text-warning bi bi-shop"></i><span
								class="nav-text text-warning">Home</span></span>
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/radio" class="nav-link">
						<span><i class="nav-icon text-warning bi bi-mic"></i><span
								class="nav-text text-warning">Radio</span></span>
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/live" class="nav-link">
						<span><i class="nav-icon text-warning bi bi-tv"></i><span
								class="nav-text text-warning">Live</span></span>
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/profile" class="nav-link">
						<span><i class="nav-icon text-warning bi bi-person"></i><span
								class="nav-text text-warning">Profile</span></span>
					</router-link>
				</li>
			</ul>
		</div>
	</footer>
	<!-- bottom navigation ends -->

	<!-- Floating Chat Button -->
	<div class="position-fixed bottom-0 end-0 m-1 z-index-5" id="fixedbuttons">
		<button class="btn btn-square rounded-circle" type="button" data-bs-toggle="offcanvas"
			data-bs-target="#chatSessionsOffcanvas">
			<img src="/images/chatbot.jpeg" style="width:50px;border-radius:50%;">
		</button>
	</div>

	<!-- SESSION LIST OFFCANVAS -->
	<div class="offcanvas offcanvas-end" tabindex="-1" id="chatSessionsOffcanvas">
		<div class="offcanvas-header border-bottom">
			<h5 class="offcanvas-title">Chat Sessions</h5>
			<button type="button" class="btn btn-secondary btn-sm ms-2" @click="createNewSession">New Chat</button>
			<button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
		</div>

		<div class="offcanvas-body">
			<div v-if="sessions.length === 0" class="text-muted small">No chats yet.</div>

			<div v-for="session in sessions" :key="session.id" class="border rounded p-2 mb-2" style="cursor:pointer;"
				@click="openChat(session.id)">
				<b>{{ session.title }}</b>
			</div>
		</div>
	</div>

	<!-- CHAT OFFCANVAS -->
	<div class="offcanvas offcanvas-end" tabindex="-1" id="chatbotOffcanvas">
		<div class="offcanvas-header border-bottom">
			<h5 class="offcanvas-title">Virtual Assistant</h5>
			<button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
		</div>

		<div class="offcanvas-body d-flex flex-column">

			<!-- Chat Messages -->
			<div class="chat-messages flex-grow-1 mb-3" style="overflow-y:auto;max-height:75vh;">
				<div v-if="messages.length === 0" class="alert alert-warning">Start the conversation.</div>

				<div v-for="(msg, index) in messages" :key="index" class="mb-2">
					<div v-if="msg.sender === 'bot'" class="alert alert-primary">{{ msg.message }}</div>
					<div v-else class="alert alert-secondary">{{ msg.message }}</div>

					<!-- show selected question/answer -->
					<div v-if="msg.question" class="small text-muted ms-2">Q: {{ msg.question }}</div>
					<div v-if="msg.selected_answer" class="small text-muted ms-2">A: {{ msg.selected_answer }}</div>
				</div>

				<!-- Questionnaire -->
				<div v-if="showQuestions && currentIndex < questions.length">
					<div class="alert alert-primary">{{ questions[currentIndex].text }}</div>

					<button v-for="opt in questions[currentIndex].options" :key="opt"
						class="btn btn-outline-primary btn-sm me-2 mb-2" @click="selectOption(opt)">
						{{ opt }}
					</button>
				</div>

			</div>

			<!-- Input -->
			<div class="input-group">
				<input type="text" v-model="userMessage" class="form-control" placeholder="Type your message...">
				<button class="btn btn-theme" @click="sendMessage">Send</button>
			</div>

		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/api'

// chat session state
const sessions = ref([])
const activeSession = ref(null)
const messages = ref([])

// Chat UI state
const userMessage = ref('')
const currentIndex = ref(0)
const showQuestions = ref(true)

// questionnaire
const questions = [
	{ text: "🥤 How many glasses of water today?", options: ["0–2", "3–5", "6–8", "More than 8"] },
	{ text: "🚶 Did you exercise 30 mins today?", options: ["Yes", "No"] },
	{ text: "🍱 Food type today?", options: ["Home", "Fast food", "Snacks", "Fruits"] }
]

// Load all sessions
const loadSessions = async () => {
	const res = await axios.get('/api/chat/sessions')
	sessions.value = res.data
}

// Create a new session
const createNewSession = async () => {
	const res = await axios.post('/api/chat/new')
	activeSession.value = res.data.session_id
	messages.value = []
	showQuestions.value = true

	// open chat offcanvas
	setTimeout(() => {
		let chatCanvas = new bootstrap.Offcanvas("#chatbotOffcanvas")
		chatCanvas.show()
	}, 200)

	await loadSessions()
}

// Open existing session
const openChat = async (id) => {
	activeSession.value = id

	const res = await axios.get(`/api/chat/history/${id}`)
	messages.value = res.data

	showQuestions.value = false

	let chatCanvas = new bootstrap.Offcanvas("#chatbotOffcanvas")
	chatCanvas.show()
}

// Send questionnaire option
const selectOption = async (option) => {
	const q = questions[currentIndex.value]

	await sendToBackend({
		message: option,
		question: q.text,
		selected_answer: option
	})

	if (currentIndex.value === questions.length - 1) {
		showQuestions.value = false
	} else {
		currentIndex.value++
	}
}

// Send free text message
const sendMessage = async () => {
	if (!userMessage.value.trim()) return

	await sendToBackend({
		message: userMessage.value
	})

	userMessage.value = ''
}

// send to backend
const sendToBackend = async ({ message, question = null, selected_answer = null }) => {
	const res = await axios.post('/api/chat/send', {
		session_id: activeSession.value,
		message,
		question,
		selected_answer
	})

	// push user message
	messages.value.push({
		sender: 'user',
		message,
		question,
		selected_answer
	})

	// push bot reply
	messages.value.push({
		sender: 'bot',
		message: res.data.reply
	})
}

// load on mount
onMounted(loadSessions)
</script>
