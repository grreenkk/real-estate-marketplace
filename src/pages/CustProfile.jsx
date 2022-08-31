import {getAuth, updateProfile} from 'firebase/auth'
import {useState, useEffect} from 'react'
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import ListingItem from '../components/ListingItem'
import homeIcon from '../assets/svg/homeIcon.svg'
import ArrowRight from '../assets/svg/keyboardArrowRightIcon.svg'



const CustProfile = () => {
    const auth = getAuth()
    
    const[showEdit, setShowEdit] = useState(false)
    const[listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const {name, email} = formData 

    const navigate = useNavigate()

    
    useEffect(()=>{
        const fetchUserListings = async ()=>{
            const listingsRef = collection(db, 'listings')

            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((data)=>{
                listings.push({
                    id: data.id,
                    data: data.data() 
                })
            })

            console.log(querySnap)
            setLoading(false)
            setListings(listings)

            
        }

        fetchUserListings()
        
    }, [auth.currentUser.uid])

    console.log(listings)

    const onLogout =()=>{
        auth.signOut()
        (navigate('/'))
    }
    
    const onSubmit = async()=> {
        try{
            if(auth.currentUser.displayName !== name){
                //Update display name in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                //Update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        }catch(error){
            toast.error('could not update')
            console.log(error)
        }
    }

    const onHelper = ()=> {
       if (showEdit){
        onSubmit()
       }  
        setShowEdit((prev)=>{return !prev})
    }

    const onChangeHandler =(e)=> {
        setFormData((prev)=> ({...prev, [e.target.id]: e.target.value})  
        )
    }

   
    
   
    const onDelete =async(id)=> {
        if(window.confirm('Are you sure you want to delete?')){
            await deleteDoc(doc(db, 'listings', id))
        }
        let listings2 = listings.filter((listing)=>{
            return listing.id !== id
        })

        setListings(listings2)
        toast.success('Successfully deleted listing')
    }

    const onEdit = (id) => {
        navigate(`/edit-listing/${id}`)
    }
    console.log(loading)
   
        
    
    
    return (
        
        <div className="profile">
            <header>
                <p className='pageHeader'>My Profile</p>
                <button type='button' className='logOut' onClick={onLogout}> 
                    Log Out
                </button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                        <p className="changePersonalDetails" onClick={onHelper}>
                            {showEdit ? 'done' : 'change'}
                        </p>
                </div>
                <div className="profileCard">
                    <input className={!showEdit ? 'profileName' : 'profileNameActive'} disabled={!showEdit} value={name} onChange={onChangeHandler} id="name" />
                    <input className={!showEdit ? 'profileEmail' : 'profileEmailActive'} disabled={!showEdit} value={email} onChange={onChangeHandler} id="email"/>
                </div>
                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt="home"/>
                    <p>Sell or rent you home</p>
                    <img src={ArrowRight} alt="arrow right"/>
                </Link>
                {!loading && listings?.length > 0 && (
                    <>
                    <p className="listingText">Your Listings</p>
                    <ul className="listingsList">   
                        {listings.map((listing)=>(
                            <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={onDelete} onEdit={onEdit}/>
                        ))}
                    </ul>
                    </>
                )}
            </main>
        </div>
    )


}

export default CustProfile