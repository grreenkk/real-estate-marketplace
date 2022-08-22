import {Navigate, Outlet} from 'react-router-dom'
import AuthBased from '../hooks/AuthBased'
import Spinner from './Spinner'

const PrivateRoute =()=>{
    const {loggedIn, checkingStatus} = AuthBased()

    console.log(loggedIn)
    
    if(checkingStatus){
        return <Spinner/>
    }

    return loggedIn ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default PrivateRoute