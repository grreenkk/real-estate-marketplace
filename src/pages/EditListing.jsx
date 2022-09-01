import { useState, useContext, useRef, useEffect} from "react"
import {getAuth, onAuthStateChanged } from 'firebase/auth'
import {useNavigate, useParams} from 'react-router-dom'
import { toast } from "react-toastify"
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {v4 as uuid4} from 'uuid'

import Spinner from '../components/Spinner'
import {db} from '../firebase.config'
import {doc, updateDoc, getDoc, serverTimestamp, getDocFromCache} from 'firebase/firestore'


const EditListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [listing, setListing] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: '1',
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0
  })

  const [images, setImages] = useState({})


  const {type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, latitude, longitude} = formData



  const auth = getAuth()
  const navigate = useNavigate()
  const params = useParams()
  const isMounted = useRef(true)

  //Redirect if listing is not user's
  useEffect(()=>{
    if(listing && listing.userRef !== auth.currentUser.uid){
      toast.error('You can not edit that listing')
      navigate('/')
    }
  })

  //Fetch listing to edit
  useEffect(()=>{
    setIsLoading(true)
    const fetchListing =async()=>{
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)
      if(docSnap.exists()){
        setListing(docSnap.data())
        setFormData({...docSnap.data(), address: docSnap.data().location})
        setIsLoading(false)
      }else{
        navigate('/')
        toast.error('Listing does not exist')
      }
    }

    fetchListing()

  }, [params.listingId, navigate])

  //Sets userRef to logged in User
  useEffect(()=>{
    if(isMounted){
      onAuthStateChanged(auth, (user) =>{
        if(user){
          setFormData({...formData, userRef: user.uid})
        }else{
          navigate('/sign-in')
        }
      })
    }
  }, [isMounted])

  const onSubmitHandler = async(e) => {
    e.preventDefault()

    setIsLoading(true)

    console.log(formData, images)
    
    if(discountedPrice >= regularPrice){
      setIsLoading(false)
      toast.error('Discounted price needs to be less than regular price')
      return
    }

    if(images.length > 6){
      setIsLoading(false)
      toast.error('Max 6 images')
      return
    }

    let geoLocation = {}
    let location 

    if(geolocationEnabled){
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address},+CA&key=AIzaSyCrJbUjWmwAwpwty7cgbsPzFNtQ_mP6V24`)

      const data = await response.json()

      console.log(data)
      console.log(data.results[0].geometry.location.lat)

      geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0
      geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0
      console.log(geoLocation)

      location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address

      if(location ===undefined || location.includes('undefined')){
        setIsLoading(false)
        toast.error('Please enter a correct address')
      }
    }else {
      geoLocation.lat = latitude
      geoLocation.lng = longitude
      
    }

    const storeImage = async(image)=> {
      return new Promise((resolve, reject)=>{
        const storage = getStorage()
        const storageRef = ref(storage, 'images/' +  image.name + uuid4())
        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            reject(error)
            
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      })
      
    }

    console.log(images, typeof images)

    const imageUrls = await Promise.all([...images].map((image)=>(storeImage(image)))).catch(()=>{
      setIsLoading(false)
      toast.error('Images not Uploaded')
      return
    }) 

    console.log(imageUrls)

    

    const formDataCopy = {
      ...formData,
      imageUrls,
      geoLocation, 
      timestamp: serverTimestamp()
    }

    formDataCopy.location = address
    delete formDataCopy.address
    location && (formDataCopy.location = location)
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    //Update listing
    const docRef = doc(db, 'listings', params.listingId)
    await updateDoc(docRef, formDataCopy)
    setIsLoading(false)
    toast.success('Listing saved')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
   
  }

  const onMutate =(e)=>{
    let boolean = null

    if(e.target.value === 'true'){
      boolean = true
    }

    if(e.target.value === 'false'){
      boolean = false
    }

    // if (e.target.files) {
    //   console.log(e.target.files)
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     images: e.target.files,
    //   }))
    // }

    // if(!e.target.files){
    //   setFormData((prev)=>({
    //     ...prev, [e.target.id] : boolean ?? e.target.value
    //   }))
    // }

    
    setFormData((prev)=>{
      return{
        ...prev,
        [e.target.id]: boolean ?? e.target.value
      }
    })


  
  }

  const forImage = (e) => {
    setImages(e.target.files)
  }

  

  


 

  return isLoading ? <Spinner/> : <div className='profile'>
    <header>
      <p className='pageHeader'>Edit listing</p>
    </header>
    <main>
      <form onSubmit={onSubmitHandler}>
      <label className='formLabel'>Sell / Rent</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

        <label className='formLabel'>Name</label>
        <input className='formInputName' type='text' id='name' value={name} onChange={onMutate} maxLength='32' minLength='10' required/>
        <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>
          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          
<label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={forImage}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Edit Listing
          </button>
      </form>
    </main>
  </div>

  
}

export default EditListing