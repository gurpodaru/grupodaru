import type { Server, CreateServerRequest } from '../../shared/types/Server'

// Helper para forçar tipo do Supabase
const forceSupabaseInsert = (supabase: any, table: string) => {
  return {
    insert: (data: any) => supabase.from(table).insert(data),
    update: (data: any) => supabase.from(table).update(data)
  }
}

// Composable para gerenciar servidores no Supabase
export const useServers = () => {
  const supabase = useSupabaseClient()
  
  // Estado reativo dos servidores
  const servers = ref<Server[]>([])
  const loading = ref(false)

  // Buscar servidores
  const loadServers = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('servidores')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      servers.value = (data || []).map((item: any) => ({
        id: item.id.toString(),
        nome: item.nome,
        serverUrl: item.server_url,
        adminToken: item.admin_token,
        status: 'offline'
      }))
    } catch (error) {
      console.error('Erro ao carregar servidores:', error)
    } finally {
      loading.value = false
    }
  }

  // Inserir novo servidor
  const addServer = async (serverData: CreateServerRequest) => {
    try {
      const helper = forceSupabaseInsert(supabase, 'servidores')
      const { data, error } = await helper.insert([{
        nome: serverData.nome,
        server_url: serverData.serverUrl,
        admin_token: serverData.adminToken
      }])
        .select()
        .single()

      if (error) throw error

      const item = data as any
      const newServer: Server = {
        id: item.id.toString(),
        nome: item.nome,
        serverUrl: item.server_url,
        adminToken: item.admin_token,
        status: 'offline'
      }
      
      servers.value.unshift(newServer)
      return newServer
    } catch (error) {
      console.error('Erro ao adicionar servidor:', error)
      return null
    }
  }

  // Excluir servidor
  const deleteServer = async (serverId: string) => {
    try {
      const { error } = await supabase
        .from('servidores')
        .delete()
        .eq('id', serverId)

      if (error) throw error

      servers.value = servers.value.filter(server => server.id !== serverId)
      return true
    } catch (error) {
      console.error('Erro ao excluir servidor:', error)
      return false
    }
  }

  // Buscar servidor por ID
  const getServerById = async (serverId: string): Promise<Server | null> => {
    try {
      const { data, error } = await supabase
        .from('servidores')
        .select('*')
        .eq('id', serverId)
        .single()

      if (error) throw error

      const item = data as any
      return {
        id: item.id.toString(),
        nome: item.nome,
        serverUrl: item.server_url,
        adminToken: item.admin_token,
        status: 'offline'
      }
    } catch (error) {
      console.error('Erro ao buscar servidor:', error)
      return null
    }
  }

  // Atualizar servidor
  const updateServer = async (serverId: string, serverData: CreateServerRequest) => {
    try {
      const helper = forceSupabaseInsert(supabase, 'servidores')
      const { data, error } = await helper.update({
        nome: serverData.nome,
        server_url: serverData.serverUrl,
        admin_token: serverData.adminToken
      })
        .eq('id', serverId)
        .select()
        .single()

      if (error) throw error

      const item = data as any
      const updatedServer: Server = {
        id: item.id.toString(),
        nome: item.nome,
        serverUrl: item.server_url,
        adminToken: item.admin_token,
        status: 'offline'
      }
      
      // Atualizar na lista local
      const index = servers.value.findIndex(s => s.id === serverId)
      if (index !== -1) {
        servers.value[index] = updatedServer
      }
      
      return updatedServer
    } catch (error) {
      console.error('Erro ao atualizar servidor:', error)
      return null
    }
  }

  // Carregar quando montar
  onMounted(() => {
    loadServers()
  })

  return {
    servers,
    loading,
    loadServers,
    addServer,
    deleteServer,
    getServerById,
    updateServer
  }
}
