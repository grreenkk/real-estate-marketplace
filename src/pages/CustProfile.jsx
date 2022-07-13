import {getAuth} from 'firebase/auth'
import {useState, useEffect} from 'react'

const CustProfile = () => {
    const [user, setUser] = useState(null)

    const auth = getAuth()

    useEffect(()=>{
        setUser(auth.currentUser)
    },[])
    return (
        user ? <h1>{user.displayName}</h1> : 'Not Logged In'
    )


}

export default CustProfile