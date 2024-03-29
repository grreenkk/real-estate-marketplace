import {useLocation, useNavigate} from 'react-router-dom'
import googleIcon from '../assets/svg/googleIcon.svg'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {db} from '../firebase.config'
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'
import { toast } from 'react-toastify'


const OAuth = () => {
    const navigate = useNavigate()
    const location = useLocation()


    const onGoogleClick = async()=>{
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const  result = await signInWithPopup(auth, provider)
            const user = result.user

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            //Checks if user exists, if not it creates the user
            if(!docSnap.exists()){
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
        }catch (error){
            toast.error('No authorization with google')
        }
    }

    return <div className="socialLogin">
          <p>Signup {location.pathname === '/sign-up' ? 'Up' : 'In'}</p>
          <button className="socialIconDiv" onClick={onGoogleClick}>
            <img className="socialIconImg" src={googleIcon} alt='google'/>
          </button>
          </div>
}

export default OAuth