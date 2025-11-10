<script setup lang="ts">
// Página de perfil do usuário
useHead({
  title: 'Meu Perfil - Minha App'
})

const { user, updatePassword } = useAuth()
const toast = useToast()

// Estados do formulário de senha
const newPassword = ref('')
const confirmPassword = ref('')

// Estados de visibilidade
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Estados de loading
const loading = ref(false)

// Validação
const isFormValid = computed(() => {
  return newPassword.value.trim() !== '' &&
         newPassword.value === confirmPassword.value &&
         newPassword.value.length >= 6
})

const passwordMatchError = computed(() => {
  if (confirmPassword.value === '') return ''
  return newPassword.value !== confirmPassword.value ? 'As senhas não coincidem' : ''
})

const passwordLengthError = computed(() => {
  if (newPassword.value === '') return ''
  return newPassword.value.length < 6 ? 'A senha deve ter no mínimo 6 caracteres' : ''
})

// Alterar senha
const handleChangePassword = async () => {
  if (!isFormValid.value) return

  loading.value = true

  try {
    await updatePassword(newPassword.value)

    toast.add({
      title: 'Sucesso!',
      description: 'Senha alterada com sucesso',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })
    
    // Limpar formulário
    newPassword.value = ''
    confirmPassword.value = ''

  } catch (error: any) {
    console.error('Erro ao alterar senha:', error)
    toast.add({
      title: 'Erro!',
      description: error.message || 'Erro ao alterar senha. Tente novamente.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NuxtLayout name="default-layout">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Meu Perfil
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      <!-- Card de Informações do Usuário -->
      <UCard class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold">Informações da Conta</h2>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <UInput
              :model-value="user?.email"
              disabled
              class="w-full"
            />
          </div>
        </div>
      </UCard>

      <!-- Card de Alterar Senha -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Alterar Senha</h2>
        </template>

        <form @submit.prevent="handleChangePassword" class="space-y-6">
          <!-- Nova Senha -->
          <div class="w-full">
            <label class="block text-sm font-medium mb-2">Nova Senha *</label>
            <UInput
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Digite sua nova senha (mín. 6 caracteres)"
              class="w-full"
              :disabled="loading"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  @click="showNewPassword = !showNewPassword"
                />
              </template>
            </UInput>
            <p v-if="passwordLengthError" class="text-sm text-red-600 dark:text-red-400 mt-1">
              {{ passwordLengthError }}
            </p>
          </div>

          <!-- Confirmar Nova Senha -->
          <div class="w-full">
            <label class="block text-sm font-medium mb-2">Confirmar Nova Senha *</label>
            <UInput
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Digite novamente sua nova senha"
              class="w-full"
              :disabled="loading"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </UInput>
            <p v-if="passwordMatchError" class="text-sm text-red-600 dark:text-red-400 mt-1">
              {{ passwordMatchError }}
            </p>
          </div>

          <!-- Botão de Salvar -->
          <div class="flex justify-end pt-4">
            <UButton
              type="submit"
              color="primary"
              size="lg"
              :disabled="!isFormValid || loading"
              :loading="loading"
            >
              {{ loading ? 'Salvando...' : 'Alterar Senha' }}
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </NuxtLayout>
</template>
