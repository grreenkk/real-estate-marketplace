import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from "../components/ListingItem"

const Category = () => {
    const params = useParams()
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setlastFetchedListing] = useState(null)


    useEffect(()=>{
        const getCategoryListings = async()=> {
            
            try{
                //Get reference
                const listingsRef = collection(db, 'listings')

                //create a query
                const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(1))

                //Execute query
                const querySnap = await getDocs(q)
                const lastVisible = querySnap.docs[querySnap.docs.length-1]
                setlastFetchedListing(lastVisible)

                const listing = []
                console.log(querySnap)

                querySnap.forEach((doc)=>{
                    return listing.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                console.log(listing)

                setListings(listing)
                setLoading(false)
            }catch(error){
                toast.error('couldnt find listings')
                console.log(error)
            }

        }

        getCategoryListings()
    }, [params.categoryName])

    //Pagination/ Load More
    const onFetchMoreListings = async()=>{
        try{
            //Get reference
            const listingsRef = collection(db, 'listings')
            

            //create a query
            const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), startAfter(lastFetchedListing), limit(10))

            //Execute query
            const querySnap = await getDocs(q)
            const lastVisible = querySnap.docs[querySnap.docs.length-1]
            setlastFetchedListing(lastVisible)
            console.log(lastVisible)
            

            const listing = []
            console.log(querySnap)

            querySnap.forEach((doc)=>{
                return listing.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            console.log(listing)

            setListings((prev)=>{
                return [...prev, ...listing]
            })
            setLoading(false)
        }catch(error){
            toast.error('couldnt find listings')
            console.log(error)
        }

    
    }

    return <div className='category'>
        <header>
            <p className="pageHeader">
                {params.categoryName ==='rent' ? 'Places for rent':'Places for sale'}
            </p>
        </header>
        {loading ? <Spinner/> : listings && listings.length > 0 ? <><main>
                <ul className='categorylistings'>{listings.map((doc)=>{
                    return(<ListingItem key={doc.id} listing={doc.data} id={doc.id}/>)
                })}</ul></main>
                <br/>
                <br/>
                {lastFetchedListing && (
                    <p className="loadMore" onClick={onFetchMoreListings}>
                        Load More 
                    </p>
                )}</>: <p>No listings in {params.categoryName}</p>}
    </div>
    
} 

export default Category