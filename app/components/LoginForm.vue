<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
    <UCard class="w-full max-w-md">
      <!-- Abas -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          @click="selectedTab = 0"
          :class="[
            'flex-1 py-3 px-4 text-center font-medium transition-colors',
            selectedTab === 0
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Login
        </button>
        <button
          @click="selectedTab = 1"
          :class="[
            'flex-1 py-3 px-4 text-center font-medium transition-colors',
            selectedTab === 1
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Criar Conta
        </button>
      </div>

      <!-- Formulário de Login -->
      <div v-if="selectedTab === 0" class="space-y-6">
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

        <div class="text-center text-sm">
          <span class="text-gray-600 dark:text-gray-400">Não tem uma conta? </span>
          <button @click="selectedTab = 1" class="text-primary hover:underline font-medium">
            Criar conta
          </button>
        </div>
      </div>

      <!-- Formulário de Registro -->
      <div v-else class="space-y-6">
        <div class="text-center space-y-2">
          <div class="flex justify-center">
            <UIcon name="i-lucide-user-plus" class="w-12 h-12 text-primary" />
          </div>
          <h2 class="text-2xl font-bold">Criar nova conta</h2>
          <p class="text-gray-600 dark:text-gray-400">Preencha seus dados para começar</p>
        </div>

        <UAlert 
          v-if="registerError"
          color="error" 
          :title="registerError"
          class="mb-4"
        />

        <UAlert 
          v-if="registerSuccess"
          color="success" 
          :title="registerSuccess"
          class="mb-4"
        />

        <form @submit.prevent="handleRegisterSubmit" class="space-y-4">
          <div class="w-full">
            <label class="block text-sm font-medium mb-2">Email</label>
            <UInput 
              v-model="registerForm.email"
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
              v-model="registerForm.password"
              :type="showRegisterPassword ? 'text' : 'password'"
              placeholder="••••••••"
              size="lg"
              required
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  :icon="showRegisterPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :padded="false"
                  @click="showRegisterPassword = !showRegisterPassword"
                />
              </template>
            </UInput>
          </div>

          <div class="w-full">
            <label class="block text-sm font-medium mb-2">Confirmar Senha</label>
            <UInput 
              v-model="registerForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="••••••••"
              size="lg"
              required
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :padded="false"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </UInput>
          </div>

          <UButton 
            type="submit" 
            color="primary" 
            size="lg"
            :loading="registerLoading"
            block
          >
            Criar Conta
          </UButton>
        </form>

        <div class="text-center text-sm">
          <span class="text-gray-600 dark:text-gray-400">Já tem uma conta? </span>
          <button @click="selectedTab = 0" class="text-primary hover:underline font-medium">
            Fazer login
          </button>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const selectedTab = ref(0)
const { signIn, signUp } = useAuth()

const loginError = ref('')
const registerError = ref('')
const registerSuccess = ref('')
const loginLoading = ref(false)
const registerLoading = ref(false)

// Estados para mostrar/esconder senhas
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: ''
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

async function handleRegisterSubmit() {
  try {
    registerLoading.value = true
    registerError.value = ''
    registerSuccess.value = ''
    
    if (!registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      registerError.value = 'Preencha todos os campos'
      return
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      registerError.value = 'As senhas não coincidem'
      return
    }
    
    if (registerForm.password.length < 6) {
      registerError.value = 'A senha deve ter no mínimo 6 caracteres'
      return
    }
    
    // Criar conta
    await signUp(registerForm.email, registerForm.password)
    
    // Fazer login automaticamente
    await signIn(registerForm.email, registerForm.password)
    
    // Redirecionar para home
    await navigateTo('/')
    
  } catch (error: any) {
    console.error('Erro no registro:', error)
    registerError.value = error.message || 'Erro ao criar conta'
  } finally {
    registerLoading.value = false
  }
}
</script>
