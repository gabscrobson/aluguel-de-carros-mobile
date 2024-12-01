import { createContext, useEffect, useState, useContext } from 'react'
import { auth, database } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, get } from 'firebase/database'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser)

    return unsubscribe
  }, [])

  async function initializeUser(user) {
    if (user) {
      setUserLoggedIn(true)
      const userUID = user.uid

      try {
        const adminRef = ref(database, `usuarios/${userUID}/isAdmin`)
        const adminSnapshot = await get(adminRef)

        const isAdminStatus = adminSnapshot.exists()
          ? adminSnapshot.val()
          : false
        setIsAdmin(isAdminStatus)

        setCurrentUser({ ...user, isAdmin: isAdminStatus })
      } catch (error) {
        console.error('Error fetching isAdmin status:', error)
        setIsAdmin(false)
      }
    } else {
      setCurrentUser(null)
      setUserLoggedIn(false)
      setIsAdmin(false)
    }
    setLoading(false)
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
