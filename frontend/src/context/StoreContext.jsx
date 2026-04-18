import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRef } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({children}) => {

    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(undefined);
    const [productList, setProductList] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const syncTimeout = useRef(null);
    const pendingActions = useRef(0);
    
    const navigate = useNavigate();

    const loadCartData = async () => {
        if(user)
        {
            // If we are actively updating the cart, don't fetch from server yet
            // to avoid overwriting the optimistic state with potentially stale DB data
            if (pendingActions.current > 0) return;

            setIsCartLoading(true);
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/get`, {}, {
                    withCredentials: true
                })
    
                if(response.data.success)
                {                
                    // Dual-check: if a user clicked while we were fetching, ignore this data
                    if (pendingActions.current === 0) {
                        setCartItems(response.data.cartData);
                    }
                }
            } catch (error) {
                console.error("Error loading cart:", error);
            } finally {
                setIsCartLoading(false);
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
    
    const scheduleCartSync = () => {
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
      syncTimeout.current = setTimeout(() => {
        loadCartData();
      }, 1000); // 1s debounce to ensure backend has settled
    };

    const addToCart = async (itemId) => {
        if(user)
        {
            // Optimistic update
            setCartItems(prev => {
              const existingItem = prev.find(item => item.product.id === itemId);
              if (existingItem) {
                return prev.map(item =>
                  item.product.id === itemId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                );
              } else {
                const product = productList.find(p => p.id === itemId);
                return [...prev, { id: `temp-${Date.now()}`, quantity: 1, product }];
              }
            });

            pendingActions.current += 1;
            try 
            {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/add`, {itemId}, {
                    withCredentials: true
                })
    
                if (!response.data.success) {
                    toast.error(response.data.error || "Failed to add item");
                }
            } catch (error) {
              console.error("Error adding to cart:", error);
              toast.error("Network error while adding to cart");
            } finally {
                pendingActions.current -= 1;
                // Only sync from server when all clicks are processed
                if (pendingActions.current === 0) {
                    scheduleCartSync();
                }
            }
        }
        else
        {
            // Guest cart logic remains same
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
            // Optimistic update
            setCartItems(prev =>
                prev.map(item =>
                    item.product.id === itemId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                ).filter(item => item.quantity > 0)
            );

            pendingActions.current += 1;
            try 
            {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/decrease`, {itemId}, {
                    withCredentials: true
                })
    
                if (!response.data.success) {
                    toast.error(response.data.error || "Failed to decrease item");
                }
            } catch (error) {
              console.error("Error decreasing from cart:", error);
              toast.error("Network error while decreasing from cart");
            } finally {
                pendingActions.current -= 1;
                if (pendingActions.current === 0) {
                    scheduleCartSync();
                }
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
            // Optimistic update
            setCartItems(prev => prev.filter(item => item.product.id !== itemId));

            pendingActions.current += 1;
            try
            {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`, {itemId}, {
                    withCredentials: true
                })
    
                if (!response.data.success) {
                    toast.error(response.data.error || "Failed to remove item");
                }
            } catch (error) {
              console.error("Error removing from cart:", error);
              toast.error("Network error while removing from cart");
            } finally {
                pendingActions.current -= 1;
                if (pendingActions.current === 0) {
                    scheduleCartSync();
                }
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
        loadCartData,
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
        fetchUserData,
        isCartLoading
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
