// import { REACT_APP_CLIENT_ID, REACT_APP_REDIRECT_URI } from '@env';

import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { createContext, ReactNode, useState, useEffect } from 'react';

import { api } from '../services/api';


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
  console.log('processe env', process.env.REACT_APP_CLIENT_ID, '\n', process.env.REACT_APP_REDIRECT_URI)

  const [user, setUser] = useState({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.REACT_APP_CLIENT_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
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
    try {
      setIsUserLoading(true)

      const tokenResponse = await api.post('/users', [access_token])
      console.log('tokenResponse', tokenResponse.data)

      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

      const userInfoResponse = await api.get('/me')
      setUser(userInfoResponse.data.user)
      console.log('userInfoResponse', userInfoResponse.data)

    } catch (error) {
      console.log(error);
      throw error;

    } finally {
      setIsUserLoading(false)
    }
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