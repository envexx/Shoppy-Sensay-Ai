import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Users, 
  MessageSquare, 
  BarChart3, 
  LogOut,
  ArrowUp
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: Briefcase, label: 'Jobs', active: false },
    { icon: Calendar, label: 'Schedule', active: false },
    { icon: Users, label: 'Community', active: false },
    { icon: MessageSquare, label: 'Messages', active: true },
    { icon: BarChart3, label: 'Analysis', active: false },
  ];

  return (
    <div className="w-64 bg-white p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center mb-12">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <span className="text-xl font-semibold text-gray-800">Workhubs</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  item.active
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-8">
        <a
          href="#"
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </a>
      </div>

      {/* Upgrade Card */}
      <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-semibold mb-1">Upgrade to Pro Account</h3>
          <p className="text-sm opacity-90 mb-3">Get more space and features</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
            Upgrade
            <ArrowUp className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute -right-8 -bottom-8 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default Sidebar;