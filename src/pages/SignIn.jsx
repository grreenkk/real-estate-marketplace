import {useState} from 'react'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {Link, useNavigate} from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import {toast} from 'react-toastify'
import OAuth from '../components/OAuth'



const SignIn = () => {
    const navigate = useNavigate()

    const [signInPayLoad, setSignInPayLoad] = useState({
        email: '',
        password: ''
    })

    const [showPassword, setShowPassword] = useState(false)

    const onChangeHandler =(e)=>{
        console.log(e.target.id)
        setSignInPayLoad((prev) => 
            ({...prev, [e.target.id] : e.target.value})
        )
    }

    const {email, password} = signInPayLoad

    const onSubmitHandler = async(e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
            if (userCredential.user) {
                navigate('/')
            }
        }catch (error){
            toast.error('Something went wrong')
            console.log(error)
        }
      
    }



    return(
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Welcome Back</p>
            </header>
            <main>
            <form onSubmit={onSubmitHandler}>
                <input className='emailInput' type='text' onChange={onChangeHandler} id='email' value={email} placeholder='Email'/>
                <div className='passwordInputDiv'>
                <input className="passwordInput" type={showPassword ? 'text' : 'password'} onChange={onChangeHandler} id='password' value={password} placeholder="Password"/>
                <img src={visibilityIcon} className='showPassword' onClick={()=>setShowPassword((prevState)=> !prevState)} />
                </div>
                <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>
                <div className="signInBar">
                    <p className="signInText">Sign In</p>
                    <button className="signInButton"><ArrowRightIcon fill="#ffffff" width="34px" height="34px"/></button>
                </div>
                <OAuth/>
                <Link to='/sign-up' className='registerLink'> Sign Up</Link>
                
                
            </form>
            </main>
           
        </div>
    )
}

export default SignIn