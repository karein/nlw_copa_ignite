import { REACT_APP_CLIENT_ID, REACT_APP_REDIRECT_URI } from '@env';

import { createContext, ReactNode, useState, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session'
import * as Google from 'expo-auth-session/providers/google'

//garantir o redirecionamento do navegado
WebBrowser.maybeCompleteAuthSession()

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void> //Promisse vazia
}

interface AuthProviderProps {
  children: ReactNode
}

//armazabar o contexto/conteudo do context
export const AuthContext = createContext({} as AuthContextDataProps);

//permite compartilhar o contexto com toda a aplicação
export function AuthContextProvider({ children }: AuthProviderProps) {
  // console.log(AuthSession.makeRedirectUri({ useProxy: true }))
  console.log('processe env', REACT_APP_CLIENT_ID, '\n', REACT_APP_REDIRECT_URI)

  const [user, setUser] = useState({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: REACT_APP_CLIENT_ID,
    redirectUri: REACT_APP_REDIRECT_URI,
    scopes: ['profile', 'email']
  })

  async function signIn() {
    console.log('vamos logar')
    try {
      setIsUserLoading(true)
      await promptAsync()

    } catch (error) {
      console.log(error)
      throw error;

    } finally {
      setIsUserLoading(false)
    }
  }

  async function signInWithGoogle(access_token: string) {
    console.log("TOKEN DE AUTENTICAÇÂO", access_token)
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}