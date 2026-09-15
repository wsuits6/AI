import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const apiKey = import.meta.env.VITE_LLM_API_KEY || '';

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setChat([...chat, userMessage]);

    try {
      const response = await axios.post(
        '/v1/chatdolphin/chat', // Chatdolphin modeli bepul tarifda ishlaydi
        {
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: message },
          ],
        },
        {
          headers: {
            Authorization: `Token ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botMessage = {
        sender: 'bot',
        text: response.data.choices[0].message.content,
      };
      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Xatolik:', error.response ? error.response.data : error.message);
      const errorMessage = {
        sender: 'bot',
        text: 'Xatolik yuz berdi: ' + (error.response?.status === 404 ? 'Endpoint topilmadi' : 'Boshqa xato'),
      };
      setChat((prev) => [...prev, errorMessage]);
    }

    setMessage('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Chatbot 🤖
        </h2>

        <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Yuborish 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;