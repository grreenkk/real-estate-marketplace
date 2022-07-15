import {useEffect, useState} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'



const AuthBased = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    const auth = getAuth()

    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setLoggedIn(true)
            }
            setCheckingStatus(false)
        })
    })

    return {loggedIn, checkingStatus}
}

export default AuthBased