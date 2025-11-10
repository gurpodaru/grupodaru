// Tipos do banco de dados Supabase
export interface Database {
  public: {
    Tables: {
      servidores: {
        Row: {
          id: number
          created_at: string
          nome: string
          server_url: string
          admin_token: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          nome: string
          server_url: string
          admin_token?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          nome?: string
          server_url?: string
          admin_token?: string | null
        }
      }
    }
  }
}
