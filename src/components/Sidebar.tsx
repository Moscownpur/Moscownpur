import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Globe, 
  MapPin, 
  Users, 
  Clock, 
  BookOpen,
  Film,
  FileText,
  Bot,
  Calendar,
  MessageSquare
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Worlds', href: '/dashboard/worlds', icon: Globe },
  { name: 'Chapters', href: '/dashboard/chapters', icon: BookOpen },
  { name: 'Characters', href: '/dashboard/characters', icon: Users },
  { name: 'Events', href: '/dashboard/events', icon: Clock },
  { name: 'Scenes', href: '/dashboard/scenes', icon: Film },
  { name: 'Dialogues', href: '/dashboard/dialogues', icon: MessageSquare },
  { name: 'Timeline', href: '/dashboard/timeline', icon: Calendar },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-72 glass-sidebar">
      <div className="p-8">
        <nav className="space-y-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-5 py-4 rounded-xl smooth-transition group ${
                  isActive
                    ? 'glass-card soft-glow text-white'
                    : 'text-white/60 hover:text-white hover:glass-card'
                }`
              }
            >
              <item.icon size={20} className="group-hover:scale-110 smooth-transition" />
              <span className="font-medium text-body">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;