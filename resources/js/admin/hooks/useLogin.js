import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [loginError, setLoginError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setLoginError(null)

    try {
      const response = await fetch(import.meta.env.VITE_API_ORIGIN+'/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    
      if (!response.ok) {
        const errorResponse = await response.json();
        //throw new Error(errorResponse.message || 'Login failed');
        setLoginError(errorResponse.message);
      }
    
      const json = await response.json();
    
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));
    
      // update the auth context
      dispatch({ type: 'LOGIN', payload: json });
    
      // update loading state
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setLoginError(error.message);
    }

  //   const response = await fetch(import.meta.env.VITE_skro_url+'login', {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json','Accept': 'application/json'},
  //     body: JSON.stringify({ email, password })
  //   })
  //   const json = await response.json()

  //   if (!response.ok) {
  //     setIsLoading(false)
  //     setError(json.message)
  //   }
  //   if (response.ok) {
  //     // save the user to local storage
  //     localStorage.setItem('user', JSON.stringify(json))

  //     // update the auth context
  //     dispatch({type: 'LOGIN', payload: json})

  //     // update loading state
  //     setIsLoading(false)
  //   }
   }

  return { login, isLoading, loginError }
}