import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Video, FileQuestion, ClipboardList } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: LayoutDashboard 
    },
    { 
      path: '/materi', 
      name: 'Materi', 
      icon: BookOpen 
    },
    { 
      path: '/video', 
      name: 'Video', 
      icon: Video 
    },
    { 
      path: '/quiz', 
      name: 'Quiz', 
      icon: FileQuestion 
    },
    {
      path: '/quiz-attempts',
      name: 'Hasil Quiz',
      icon: ClipboardList
    }
  ];

  return (
    <div className="flex h-screen bg-[#FFF8DC]">
      {/* Sidebar */}
      <div className="w-64 bg-[#497D74] text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-[#FFD95F]">Admin Giat Cerika</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-lg transition-colors duration-200 
                  ${isActive(item.path) 
                    ? 'bg-[#FFD95F] text-[#497D74]' 
                    : 'text-white hover:bg-[#5c8f86]'}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;