import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaSignOutAlt, FaPlus, FaComment, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Bot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [chatHistories, setChatHistories] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:4002/api/user/chathistory', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChatHistories(res.data.chatHistory);
            if (res.data.chatHistory.length > 0) {
                // By default, load the most recent chat
                const lastChat = res.data.chatHistory[0];
                setActiveChatId(lastChat._id);
                setMessages(lastChat.messages);
            } else {
                handleNewChat();
            }
        } catch (error) {
            console.error('Failed to fetch chat history', error);
            toast.error('Failed to load chat history.');
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const currentInput = input;
        const oldMessages = messages;
        setMessages([...messages, { text: currentInput, sender: 'user' }]);
        setInput('');

        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.post(
                'http://localhost:4002/bot/v1/message',
                { text: currentInput, chatId: activeChatId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages(res.data.messages);
            setActiveChatId(res.data.chatId);

            // Refresh chat history list if it was a new chat
            if (!chatHistories.some(chat => chat._id === res.data.chatId)) {
                fetchChatHistory();
            } else {
                // Update title of existing chat if it was just a placeholder
                setChatHistories(histories => histories.map(h =>
                    h._id === res.data.chatId ? { ...h, title: res.data.messages[0].text.substring(0, 30) + '...' } : h
                ));
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to get response.');
            setMessages(oldMessages); // Restore old messages on error
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        setActiveChatId(null);
        setMessages([]);
        setInput('');
    };

    const handleSelectChat = (chatId) => {
        const chat = chatHistories.find(c => c._id === chatId);
        if (chat) {
            setActiveChatId(chat._id);
            setMessages(chat.messages);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) handleSendMessage();
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className='flex h-screen bg-[#0d0d0d] text-white'>
            {/* Left Sidebar */}
            <aside className="w-64 bg-gray-900 flex flex-col p-2">
                <button onClick={handleNewChat} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors w-full text-left mb-4">
                    <FaPlus /> New Chat
                </button>
                <div className="flex-1 overflow-y-auto">
                    <h2 className="text-xs font-bold text-gray-400 uppercase px-2 mb-2">Recent</h2>
                    {chatHistories.map(chat => (
                        <div
                            key={chat._id}
                            onClick={() => handleSelectChat(chat._id)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${activeChatId === chat._id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <FaComment className="flex-shrink-0" />
                                <span className="truncate">{chat.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="relative">
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <FaUserCircle size={24} />
                        <span className="truncate">{JSON.parse(sessionStorage.getItem('user'))?.email || 'User'}</span>
                    </div>
                    {dropdownOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                            >
                                <FaSignOutAlt size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-y-auto pb-24 flex justify-center">
                    <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-3 pt-6">
                        {messages.length === 0 && !loading ? (
                            <div className="flex-1 flex items-center justify-center text-center">
                                <div>
                                    <h1 className="text-4xl font-bold">BotSpoof</h1>
                                    <p className="text-gray-400">How can I help you today?</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`px-4 py-2 rounded-xl max-w-[75%] whitespace-pre-wrap ${msg.sender === 'user'
                                                ? 'bg-blue-600 text-white self-end'
                                                : 'bg-gray-800 text-gray-100 self-start'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-xl max-w-[60%] self-start">
                                        Bot is typing...
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>
                </main>

                <footer className="w-full border-t border-gray-800 bg-[#0d0d0d] z-10 self-center max-w-4xl mx-auto">
                    <div className="flex justify-center px-4 py-3">
                        <div className="w-full flex bg-gray-900 rounded-full px-4 py-2 shadow-lg">
                            <input
                                type="text"
                                className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2"
                                placeholder="Ask BotSpoof..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={loading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed px-4 py-1 rounded-full text-white font-medium transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Bot;