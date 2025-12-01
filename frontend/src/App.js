import { Routes, Route} from 'react-router-dom'
import { CartContext } from './Context';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/homePage';
import Categories from './components/Categories';
import CategoryProducts from './components/CategoryProducts';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Register from './components/Register';
import LogIn from './components/LogIn';
import Dashboard from './components/Dashboard'
import Orders from './components/Orders';
import Profile from './components/Profile';
import AddressBook from './components/AddressBook';
import Wallet from './components/Wallet';
import LogOut from './components/LogOut';
import Home from './components/Home';
import Checkout from './components/Checkout';
import OrderPlaced from './components/OrderPlaced';
import SearchResults from './components/SearchResults';

const checkCart=localStorage.getItem('cartData')
function App() {
    const [cartData, setCartData] = useState(JSON.parse(checkCart));

    return (
        <CartContext.Provider value={{cartData,setCartData} }>
            <Header />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/Categories' element={<Categories />} />
                <Route path='/Category/:category' element={<CategoryProducts />} />
                <Route path='/Product/:product' element={<ProductDetail />} />
                <Route path='/Cart' element={<Cart />} />
                <Route path='/Profile' element={<Profile />} />
                <Route path='/AddressBook' element={<AddressBook />} />
                <Route path='/Wallet' element={<Wallet />} />
                <Route path='/Checkout' element={<Checkout />} />
                <Route path='/OrderPlaced' element={<OrderPlaced />} />
                <Route path="/search-results" element={<SearchResults />} />

                //profile panel
                <Route path='/Register' element={<Register />} /> 
                <Route path='/LogIn' element={<LogIn />} /> 
                <Route path='customer/LogOut' element={<LogOut />} />
                <Route path='/Dashboard' element={<Dashboard />} />
                <Route path='/Orders' element={<Orders />} />
                <Route path='/customer/Home' element={<Home />} />




                
                

            </Routes>
            <Footer />
        </CartContext.Provider>
    );
}

export default App;
