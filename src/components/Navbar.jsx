import {useNavigate, useLocation} from 'react-router-dom'
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as PersonOutlineIcon} from '../assets/svg/personOutlineIcon.svg'

const Navbar = () => {
    const navigate = useNavigate() //Helps to navigate to routes just like link
    const location = useLocation()

    const correctPath = (route)=>{
        if(route === location.pathname){
            return true
        }
    }

    return (
        <footer className='navbar'>
            <nav className='navbarNav'>
                <ul className='navbarListItems'>
                    <li className="navbarListItem" onClick={()=>navigate('/')}>
                        <ExploreIcon fill={correctPath('/') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px'/>
                        <p>Explore</p>
                    </li>
                    <li className="navbarListItem" onClick={()=>navigate('/offers')}>
                        <OfferIcon fill={correctPath('/offers') ? '#2c2c2c' : '#8f8f8f' } width='36px' height='36px'/>
                        <p>Offers</p>
                    </li>
                    <li className='navbarListItem' onClick={()=>navigate('/profile')}>
                        <PersonOutlineIcon fill={correctPath('/sign-in') ?'#2c2c2c' : '#8f8f8f'} width='36px' height='36px'/>
                        <p>Profile</p>
                    </li>
                </ul>

            </nav>
        </footer>
    )
}

export default Navbar