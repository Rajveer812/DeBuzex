import React,{createContext,useState,useEffect} from 'react';
import axios from 'axios';
export const AuthContext=createContext();
import { socket } from '../socket';

export const AuthProvider=({children})=>{
    const[user,setUser]=useState(null);

    const [isModalOpen,setIsModalOpen]=useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Messages State
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const res = await axios.get(`\${import.meta.env.VITE_BACKEND_URL || '\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch(err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    const fetchUnreadMessageCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const res = await axios.get(`\${import.meta.env.VITE_BACKEND_URL || '\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}/api/message/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadMessageCount(res.data.unreadCount);
        } catch (err) {
            console.error("Failed to fetch unread message count", err);
        }
    };

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
            fetchNotifications(); // Initial fetch on load
            fetchUnreadMessageCount();
        } else {
        // NEW: If no user is found, automatically open the popup!
            setIsModalOpen(true); 
        }

        // Listen for global online users updates
        const handleOnlineUsers = (users) => {
            setOnlineUsers(users);
        };
        const handleNewNotification = (newNotif) => {
            setNotifications(prev => [newNotif, ...prev]);
        };
        const handleMessageReceived = () => {
            fetchUnreadMessageCount(); // Sync with server when message arrives
        };

        socket.on("online users", handleOnlineUsers);
        socket.on("new_notification", handleNewNotification);
        socket.on("message received", handleMessageReceived);

        return () => {
            socket.off("online users", handleOnlineUsers);
            socket.off("new_notification", handleNewNotification);
            socket.off("message received", handleMessageReceived);
        };
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
        fetchNotifications(); // Fetch notifications immediately after logging in
        fetchUnreadMessageCount();
    }

        const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    };

    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    };

    return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isModalOpen, setIsModalOpen, onlineUsers, notifications, setNotifications, unreadCount, unreadMessageCount, fetchUnreadMessageCount }}>
      {children}
    </AuthContext.Provider>
  );
};



