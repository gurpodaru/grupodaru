export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Criar conta com email e senha (sem confirmação de email)
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Desabilita redirect de email
      }
    })

    if (error) throw error
    return data
  }

  // Fazer login com email e senha
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  // Fazer logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user,
    signUp,
    signIn,
    signOut
  }
}
