import React, { useContext } from 'react';
import {House,MessageCircleMore,Compass,Bookmark,UserCog,Settings,Bell} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
      const { user, unreadCount } = useContext(AuthContext);

      return (
        <aside 
          // 1. 'group' tracks the hover state for all child elements.
          // 2. Base width is 68px, hover width scales up to 220px.
          // 3. z-50 ensures it floats on top of your main feed when open.
          className="group fixed left-0 top-[95px] h-[calc(100vh-70px)] bg-[#050c1a]/95 backdrop-blur-md border-r border-white/10 transition-all duration-300 ease-in-out z-50 flex flex-col w-[68px] hover:w-[250px] px-2 hover:px-3 overflow-hidden"
        >
          {/* Menu Header - Fades and slides in on hover */}
          <div className="text-[10px] font-bold tracking-widest text-[#555d72] uppercase mb-2 mt-6 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:px-2">
            Menu
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 border-b border-white/10">
            <NavItem icon={<House />} label="Home" isActive={true} path='/' />
            <NavItem icon={<MessageCircleMore />} label="Messages" path='/chat' />
            <NavItem icon={<Bell />} label="Notifications" badge={unreadCount > 0 ? unreadCount : null} path='/notifications' />
            <NavItem icon={<Compass />} label="Explore" isGreenBadge={true} path='/explore' />
            <NavItem icon={<Bookmark />} label="Saved Problems" path="/saved" />
          </nav>

          <div className="text-[10px] font-bold tracking-widest text-[#555d72] uppercase mb-2 mt-6 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:px-2">
            Account
          </div>
          <nav className="flex flex-col gap-1 border-b border-white/10">
            <NavItem icon={<UserCog />} label="My Profile" path="/myProfile" />
            <NavItem icon={<Settings/>} label="Settings"  path="/setting"/>
            <NavItem icon={<Compass />} label="About App"  isGreenBadge={true} path="/aboutApp" />
          </nav>

          {/* User Card at the bottom */}
          <div className="mt-auto mb-9">
            <div className="bg-[#1e2330] border border-white/10 rounded-xl p-2 group-hover:p-3 transition-all duration-300 flex items-center">
              {user?.profilePic && user.profilePic !== "default-avatar.png" ? (
                <img src={user.profilePic} alt="avatar" className="w-[34px] h-[34px] rounded-lg object-cover shrink-0 border border-white/20" />
              ) : (
                <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center shrink-0 text-xs">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              
              {/* User Details - Fade and expand on hover */}
              <div className="w-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:w-auto group-hover:opacity-100 group-hover:ml-3">
                <div className="text-[13px] font-bold text-white whitespace-nowrap">{user?.name}</div>
                <div className="text-[11px] text-[#8b92a8]">@{user?.username}</div>
              </div>
            </div>
          </div>
        </aside>
      );
    };

    // --- Helper Component for the Links ---
    const NavItem = ({ icon, label, isActive, badge, isGreenBadge,path }) => {
      return (
        <a href={path} className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200 overflow-hidden ${
          isActive 
            ? 'bg-[#6ee7b7]/10 text-[#6ee7b7] border border-[#6ee7b7]/20' 
            : 'text-[#8b92a8] hover:bg-[#1e2330] hover:text-white'
        }`}>
          <div className="shrink-0 w-[18px] h-[18px] flex justify-center items-center">
            {icon}
          </div>
          
          {/* Label - Starts hidden, slides right on hover */}
          <span className="whitespace-nowrap text-[13.5px] font-medium opacity-0 w-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:w-auto group-hover:translate-x-0 group-hover:ml-3">
            {label}
          </span>

          {/* Badge - Starts tiny and invisible, pops up on hover */}
          {badge && (
            <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full opacity-0 scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 ${
              isGreenBadge ? 'bg-[#6ee7b7] text-[#0d0f14]' : 'bg-[#fb923c] text-white'
            }`}>
              {badge}
            </span>
          )}
        </a>
      );
    };

export default Sidebar;