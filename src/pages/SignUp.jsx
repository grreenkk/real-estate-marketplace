import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import {Link, useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import OAuth from '../components/OAuth'




const SignUp = () => {
    const navigate = useNavigate()
    const [inputPayload, setInputPayload] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [showPassword, setShowPassword] = useState(false)

    const onChangeHandler =(e)=> {
        setInputPayload((prev)=>({...prev, [e.target.id]: e.target.value}))

    }

   

    const {name, email, password } = inputPayload

    console.log(name)

    const onSubmitHandler = async(e) => {
        e.preventDefault()

        try {
            const auth=getAuth()

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            const user = userCredential.user

            updateProfile(auth.currentUser, {
                displayName: name
            })

            const inputPayLoadCopy = {...inputPayload}
            delete inputPayLoadCopy.password
            inputPayLoadCopy.timeStamp = serverTimestamp()
            setDoc(doc(db, 'users', user.uid), inputPayLoadCopy)


            navigate('/')
        }catch(error){
            console.log(error)
            toast.error('Wrong entries')
        }
    }

    

    return(
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Welcome Back</p>
            </header>
        <main>
            <form onSubmit={onSubmitHandler}>
                <input className='emailInput' placeholder='Name' id='name' onChange={onChangeHandler} value={name}/>
                <input className='emailInput' placeholder='Email' id='email' onChange={onChangeHandler} value={email}/>
                <div className='passwordInputDiv'>
                    <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder="Password" onChange={onChangeHandler} value={password} id="password"/>
                    <img src={visibilityIcon} className='showPassword' onClick={()=>setShowPassword((prev)=>setShowPassword(!prev))} />
                </div>
                <Link to="/forgot-password" className='forgotPasswordLink'>Forgot Password</Link>
                <div className="signInBar">
                    <p className="signInText">Sign Up</p>
                    <button className="signInButton"><ArrowRightIcon fill="#ffffff" width="34px" height="34px"/></button>
                </div>
                <OAuth/>
                <Link to='/sign-in' className='registerLink'>Sign In</Link>
            </form>
        </main>
       
    </div>
    )
}

export default SignUp