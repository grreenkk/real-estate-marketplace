import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PageExplore from './pages/PageExplore';
import Offers from './pages/Offers';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import CustProfile from './pages/CustProfile';
import Navbar from './components/Navbar';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoutes from './components/PrivateRoutes'
import Category from './pages/Category';
import CreateListing from './pages/CreateListings';




function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<PageExplore/>} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/category/:categoryName' element={<Category />}/>
          <Route path='/sign-in' element={<SignIn/>} />
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/profile' element={<PrivateRoutes/>}>
            <Route path='/profile' element={<CustProfile/>}/>
          </Route>
          <Route path='/create-listing' element={<CreateListing/>}/>
        </Routes>
        <Navbar/>
      </Router>
      <ToastContainer/>
     
    </>
  );
}

export default App;
