<script setup lang="ts">
import type { Server, CreateServerRequest } from '../../shared/types/Server'

// Página inicial - Meus Servidores
useHead({
  title: 'Meus Servidores - Minha App'
})

// Usar o composable para gerenciar servidores
const { servers, loadServers, addServer, deleteServer, updateServer } = useServers()
const loading = ref(false)

// Estados dos modais
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const serverToDelete = ref<string | null>(null)
const serverToEdit = ref<Server | null>(null)

// Handlers dos eventos
const handleDeleteServer = (serverId: string) => {
  serverToDelete.value = serverId
  isDeleteModalOpen.value = true
}

const handleEditServer = (server: Server) => {
  serverToEdit.value = server
  isModalOpen.value = true
}

const confirmDelete = async () => {
  if (serverToDelete.value) {
    await deleteServer(serverToDelete.value)
    serverToDelete.value = null
  }
}

const handleViewDetails = (server: Server) => {
  console.log('Ver detalhes:', server)
  // Implementar lógica de visualização
}

const handleAddServer = () => {
  serverToEdit.value = null
  isModalOpen.value = true
}

const handleModalSubmit = async (serverData: CreateServerRequest) => {
  if (serverToEdit.value) {
    // Editar servidor existente
    await updateServer(serverToEdit.value.id, serverData)
  } else {
    // Adicionar novo servidor
    await addServer(serverData)
  }
  isModalOpen.value = false
  serverToEdit.value = null
}
</script>

<template>
  <NuxtLayout name="default-layout">
    <div class="container mx-auto px-4 py-8">
      <!-- Header da página -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Meus Servidores
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Gerencie e monitore seus servidores
          </p>
        </div>
        
        <div class="flex gap-3">
          <!-- Botão para adicionar servidor -->
          <UButton 
            color="primary" 
            size="lg" 
            icon="i-heroicons-plus"
            class="cursor-pointer hover:cursor-pointer"
            @click="handleAddServer"
          >
            Adicionar Servidor
          </UButton>
        </div>
      </div>

      <!-- Lista de servidores -->
      <ServerList
        :servers="servers"
        :loading="loading"
        @delete-server="handleDeleteServer"
        @view-details="handleViewDetails"
        @edit-server="handleEditServer"
      />
    </div>

    <!-- Modal para adicionar/editar servidor -->
    <ServerModal
      v-model:open="isModalOpen"
      :server="serverToEdit"
      @submit="handleModalSubmit"
    />

    <!-- Modal de confirmação para exclusão -->
    <ConfirmationModal
      v-model:open="isDeleteModalOpen"
      title="Excluir Servidor"
      message="Tem certeza que deseja excluir este servidor? Esta ação não pode ser desfeita."
      confirm-text="Excluir"
      confirm-color="error"
      icon="i-lucide-trash-2"
      @confirm="confirmDelete"
    />
  </NuxtLayout>
</template>
