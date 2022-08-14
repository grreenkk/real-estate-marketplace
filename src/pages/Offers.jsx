import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from "../components/ListingItem"

const Offers = () => {
    const params = useParams()
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        const getOffersListings = async()=> {
            
            try{
                //Get reference
                const listingsRef = collection(db, 'listings')

                //create a query
                const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(10))

                //Execute query
                const querySnap = await getDocs(q)//Gets the doc for the particular query
                const listing = []

                querySnap.forEach((doc)=>{
                    return listing.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listing)
                setLoading(false)
            }catch(error){
                toast.error('couldnt find listings')
                console.log(error)
            }

        }

        getOffersListings()
    }, [])

    console.log(listings)

    return <div className='category'>
        <header>
            <p className="pageHeader">
               Offers
            </p>
        </header>
        {loading ? <Spinner/> : listings && listings.length > 0 ? <main>
                <div>{listings.map((doc)=>{
                    return(<ListingItem listing={doc.data} id={doc.id}/>)
                })}</div></main>: <p>No Offers available</p>}
    </div>
    
} 

export default Offers