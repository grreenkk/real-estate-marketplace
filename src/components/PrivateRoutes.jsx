import {Navigate, Outlet} from 'react-router-dom'
import AuthBased from '../hooks/AuthBased'

const PrivateRoute =()=>{
    const {loggedIn, checkingStatus} = AuthBased()

    console.log(loggedIn)
    
    if(checkingStatus){
        return <h3>Loading....</h3>
    }

    return loggedIn ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default PrivateRoute