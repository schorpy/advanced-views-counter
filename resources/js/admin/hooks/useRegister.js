import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useRegister = () => {
  const [registerError, setRegisterError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const register = async (email, password) => {
    setIsLoading(true)
    setRegisterError(null)

    try {
      const response = await fetch(import.meta.env.VITE_skro_url+'register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    
      if (!response.ok) {
        const errorResponse = await response.json();
        //throw new Error(errorResponse.message || 'Register failed');
        setRegisterError(errorResponse.message);
      }
    
      const json = await response.json();
    
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));
    
      // update the auth context
      // dispatch({ type: 'Register', payload: json });
    
      // update loading state
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setRegisterError(error.message);
    }

   }

  return { register, isLoading, registerError }
}