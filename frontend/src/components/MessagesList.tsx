import React from 'react';
import { Search, MoreHorizontal, Star, Phone } from 'lucide-react';

interface MessagesListProps {
  selectedContact: string;
  onContactSelect: (contact: string) => void;
}

const MessagesList = ({ selectedContact, onContactSelect }: MessagesListProps) => {
  const conversations = [
    {
      name: 'Jennifer Markus',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
      message: 'Hey! Are you back he? It overthrows for flora say more',
      time: '10:36 PM',
      unread: false,
      online: true
    },
    {
      name: 'Mortha Elliott',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
      message: 'Okk, I got it will do it after some time and let you know 😊',
      time: '10:36 PM',
      unread: false,
      online: true
    },
    {
      name: 'Timothy Sam',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=100',
      message: 'What can last challenge of Cath app and did all amazing. How about you?',
      time: '10:36 PM',
      unread: false,
      online: false
    },
    {
      name: 'Rose George',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100',
      message: 'Hi Please check these illustration for fitness app Lut me know your feedback.',
      time: '',
      unread: false,
      online: false,
      starred: true
    },
    {
      name: 'Terry McBride',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100',
      message: 'Received! Let me your design it nearly butterfly Skipped. Good job here',
      time: '',
      unread: false,
      online: false
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">8 Running Projects</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* All Messages dropdown and profile */}
        <div className="flex items-center justify-between mb-4">
          <select className="bg-transparent text-gray-700 font-medium border-none outline-none">
            <option>All Messages</option>
            <option>Unread</option>
            <option>Archived</option>
          </select>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100"
                alt="Mortha Elliott"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Aman Malik</p>
                <p className="text-xs text-gray-500">Product Designer</p>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Star className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Search className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search start a new chat"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border-none outline-none text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation, index) => (
          <div
            key={index}
            onClick={() => onContactSelect(conversation.name)}
            className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedContact === conversation.name ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            }`}
          >
            <div className="relative mr-3">
              <img
                src={conversation.avatar}
                alt={conversation.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conversation.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                <div className="flex items-center space-x-1">
                  {conversation.starred && (
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  )}
                  {conversation.time && (
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate">{conversation.message}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-xs text-gray-400">2 hours • 6 replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesList;