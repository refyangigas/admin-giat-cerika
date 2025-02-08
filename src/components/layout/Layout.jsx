import { useState } from 'react';
import { Menu, ChevronLeft, ChevronRight, Book, Video, ListChecks } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { title: 'Materi', icon: Book, path: '/materi' },
    { title: 'Video', icon: Video, path: '/video' },
    { title: 'Quiz', icon: ListChecks, path: '/quiz' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && <span className="text-xl font-bold">Admin Panel</span>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 mb-2"
            >
              <item.icon size={24} />
              {sidebarOpen && <span>{item.title}</span>}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-sm">
          <div className="p-4">
            <Menu className="h-6 w-6" />
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;