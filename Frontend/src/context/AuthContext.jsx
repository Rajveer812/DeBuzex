import React,{createContext,useState,useEffect} from 'react';
export const AuthContext=createContext();
import { socket } from '../socket';

export const AuthProvider=({children})=>{
    const[user,setUser]=useState(null);

    const [isModalOpen,setIsModalOpen]=useState(false);

    // Check if a user is already logged in when the app loads
    useEffect(() => {
        const savedUser = localStorage.getItem('userInfo');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            // Setup on initial load if socket is already connected
            if (socket.connected) {
                socket.emit("setup", parsedUser);
            }
        } else {
        // NEW: If no user is found, automatically open the popup!
            setIsModalOpen(true); 
        }
    }, []);

    // Ensure we ALWAYS setup the user room when socket connects/reconnects
    useEffect(() => {
        const onConnect = () => {
            if (user) {
                socket.emit("setup", user);
            }
        };

        socket.on("connect", onConnect);
        
        // If it connected before this effect ran:
        if (socket.connected && user) {
            socket.emit("setup", user);
        }

        return () => {
            socket.off("connect", onConnect);
        };
    }, [user]);

    const login=(userData)=>{
        setUser(userData);// 1. Put the user in short-term memory so the UI updates instantly
        localStorage.setItem('userInfo',JSON.stringify(userData));// 2. Put the user in long-term memory (localStorage) so it survives page refreshes
        localStorage.setItem('token',userData.token); // 3. Save the actual secret VIP Wristband (the JWT token) from the backend
        setIsModalOpen(false); // 4. Close the popup window automatically
        socket.emit("setup", userData);
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



