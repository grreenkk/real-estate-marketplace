import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import { Link } from 'react-router-dom'
import {useState} from 'react'
import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'



const ForgotPassword = () => {
    const [email, setEmail] = useState('')

    const onChangeHandler = (e) => {
        setEmail(e.target.value)
    }

    const submitHandler =async()=> {
        

        try{
            const auth = getAuth()
            sendPasswordResetEmail(auth, email)
            toast.success('Email was sent')
        }catch(error) {
            toast.error()

        }
    }

    console.log(email)


    return(
        <div className='pageContainer'>
            <header>
            <p className="pageheader">Forgot Password</p>
            </header>
            <main>
                <form onSubmit={submitHandler}>
                    <input type='email' className='emailInput' id='email' placeholder='Email' onChange={onChangeHandler}/>
                    <Link className="forgotPasswordLink" to="/sign-in" value={email}>
                        Sign In
                    </Link>
                    <div className="signInBar">
                        <div className="signInText">Send Reset</div>
                        <button className="signInButton">< ArrowRightIcon fill='#ffffff' width='34px' height='34px'/></button>
                        
                    </div>
                </form>
            </main>
            
        </div>
    )
}

export default ForgotPassword