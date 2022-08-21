import {getDoc, doc} from 'firebase/firestore'
import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { db } from '../firebase.config'
import { useSearchParams } from 'react-router-dom'



const Contact = () => {
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [landlord, getLandlord] = useState(null)
  const [message, setMessage] = useState()
  
  useEffect(()=>{
    const getLandLord = async() => {
      const docRef = doc(db, 'users', params.listingId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()) {
        console.log(docSnap.data())
        getLandlord(docSnap.data())
      }else{
        toast.error('Could not get landlord data')
      }
      
    }

    getLandLord()
  }, [params.listingId])

  const onChange = (e)=>{
    setMessage(e.target.value)
  }

  console.log(landlord)

  return <div className='pageContainer'>
    <header>
      <p className='pageHeader'>Contact landlord</p>
    </header>
    {landlord !== null && (
      <main>
        <div className='contactLandlord'>
      <p className='landlordName'>Contact {landlord.name}</p>
        </div>
        <form className='messageForm'>
          <div className='messageDiv'>
            <label htmlFor="message" className="messageLabel">
              Message
            </label>
            <textarea name="message" id='message' className='textarea' value={message} onChange={onChange}></textarea>
          </div>
          <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
            <button type="button" className="primaryButton">Send Message</button>
          </a>
        </form>
      </main>
    )}
  </div>
}

export default Contact