import React,{createContext,useState,useEffect} from 'react';
export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const[user,setUser]=useState(null);

    const [isModalOpen,setIsModalOpen]=useState(false);

    // Check if a user is already logged in when the app loads
    useEffect(() => {
        const savedUser = localStorage.getItem('userInfo');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
        // NEW: If no user is found, automatically open the popup!
            setIsModalOpen(true); 
        }
    }, []);

    const login=(userData)=>{
        setUser(userData);// 1. Put the user in short-term memory so the UI updates instantly
        localStorage.setItem('userInfo',JSON.stringify(userData));// 2. Put the user in long-term memory (localStorage) so it survives page refreshes
        localStorage.setItem('token',userData.token); // 3. Save the actual secret VIP Wristband (the JWT token) from the backend
        setIsModalOpen(false); // 4. Close the popup window automatically
    }

        const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    };
    return (
    <AuthContext.Provider value={{ user, login, logout, isModalOpen, setIsModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
};



