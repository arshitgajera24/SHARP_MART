import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = ({children}) => {

    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(undefined);
    const [productList, setProductList] = useState([]);
    const [userData, setUserData] = useState(null);
    
    const navigate = useNavigate();

    const loadCartData = async () => {
        if(user)
        {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/get`, {}, {
                withCredentials: true
            })

            if(response.data.success)
            {                
                setCartItems(response.data.cartData);
            }
        }
    }

    const fetchUserData = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
            withCredentials: true
        });
        if(response.data.success)
        {
            setUserData(response?.data?.data[0]);
        }
        else
        {
            toast.error(response.data.error);
            if(response.data.redirect)
            {
                navigate(response.data.redirect);
            }
            setUser(null);
            setUserData(null);
            navigate("/");
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        cartItems.forEach(item => {
            if(item.product.price && item.quantity > 0)
            {
                totalAmount += item.product.price * item.quantity;
            }
        })

        return totalAmount;
    }

    const addToCart = async (itemId) => {
        if(user)
        {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/add`, {itemId}, {
                withCredentials: true
            })

            if (response.data.success) {
                await loadCartData();
            }
        }
        else
        {
            const existingItem = cartItems.find(item => item.product.id === itemId);
            if(existingItem)
            {
                setCartItems(prev => 
                    prev.map(item => 
                        item.product.id === itemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    )
                );
            }
            else
            {
                const product = productList.find(p => p.id === itemId);
                setCartItems(prev => [...prev, { id: Date.now(), quantity: 1, product }]);
            }
        }
    }

    const decreaseFromCart = async (itemId) => {
        if(user)
        {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/decrease`, {itemId}, {
                withCredentials: true
            })

            if (response.data.success) {
                await loadCartData();
            }
        }
        else
        {
            setCartItems(prev =>
                prev.map(item =>
                    item.product.id === itemId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                ).filter(item => item.quantity > 0)
            );

        }
    }

    const removeFromCart = async (itemId) => {
        if(user)
        {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`, {itemId}, {
                withCredentials: true
            })

            if (response.data.success) {
                await loadCartData();
            }
        }
        else
        {
            setCartItems(prev => prev.filter(item => item.product.id !== itemId));
        }
    }

    const fetchProductList = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);

        if(response.data.success)
        {
            setProductList(response.data.data);
        }
        if(!response.data.success)
        {
            toast.error(response.data.error);
        }
    }

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
                withCredentials: true
            });
            
            if (response.data.success) 
            {
                setUser(response.data.user);
            }
            else
            {
                toast.error(response.data.error)
                setUser(null);
                setUserData(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        async function loadData()
        {
            await loadCartData();
            await fetchProductList();
        }        
        loadData();
        fetchUser();
    }, [])

    useEffect(() => {
        if(user === undefined) return;
        if(user)
        {
            loadCartData();
            fetchUserData();
        }
        else
        {
            setCartItems([]);
        }
    }, [user])

    const contextValue = {
        productList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        decreaseFromCart,
        getTotalCartAmount,
        user,
        setUser,
        userData,
        setUserData,
        fetchUserData
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;