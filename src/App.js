import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PageExplore from './pages/PageExplore';
import Offers from './pages/Offers';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import CustProfile from './pages/CustProfile';
import Navbar from './components.jsx/Navbar';




function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<PageExplore/>} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/sign-in' element={<SignIn/>} />
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/profile' element={<SignIn/>}/>
        </Routes>
        <Navbar/>
      </Router>
      
     
    </>
  );
}

export default App;
