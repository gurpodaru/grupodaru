<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
    <UCard class="w-full max-w-md">
      <!-- Formulário de Login -->
      <div class="space-y-6">
        <div class="text-center space-y-2">
          <div class="flex justify-center">
            <UIcon name="i-lucide-log-in" class="w-12 h-12 text-primary" />
          </div>
          <h2 class="text-2xl font-bold">Entre na sua conta</h2>
          <p class="text-gray-600 dark:text-gray-400">Digite seus dados para acessar</p>
        </div>

        <UAlert 
          v-if="loginError"
          color="error" 
          :title="loginError"
          class="mb-4"
        />

        <form @submit.prevent="handleLoginSubmit" class="space-y-4">
          <div class="w-full">
            <label class="block text-sm font-medium mb-2">Email</label>
            <UInput 
              v-model="loginForm.email"
              type="email"
              placeholder="seu@email.com"
              size="lg"
              required
              class="w-full"
            />
          </div>

          <div class="w-full">
            <label class="block text-sm font-medium mb-2">Senha</label>
            <UInput 
              v-model="loginForm.password"
              :type="showLoginPassword ? 'text' : 'password'"
              placeholder="••••••••"
              size="lg"
              required
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  :icon="showLoginPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :padded="false"
                  @click="showLoginPassword = !showLoginPassword"
                />
              </template>
            </UInput>
          </div>

          <UButton 
            type="submit" 
            color="primary" 
            size="lg"
            :loading="loginLoading"
            block
          >
            Entrar
          </UButton>
        </form>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { signIn } = useAuth()

const loginError = ref('')
const loginLoading = ref(false)

// Estado para mostrar/esconder senha
const showLoginPassword = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

async function handleLoginSubmit() {
  try {
    loginLoading.value = true
    loginError.value = ''
    
    if (!loginForm.email || !loginForm.password) {
      loginError.value = 'Preencha todos os campos'
      return
    }
    
    await signIn(loginForm.email, loginForm.password)
    await navigateTo('/')
    
  } catch (error: any) {
    console.error('Erro no login:', error)
    loginError.value = error.message || 'Email ou senha incorretos'
  } finally {
    loginLoading.value = false
  }
}
</script>
