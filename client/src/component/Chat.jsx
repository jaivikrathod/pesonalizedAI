import React from 'react'
import "../css/chat.css"
export default function Chat() {
    return (
        <div className='chat-main'>
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">

                <div className="bg-blue-500 text-white p-4 text-center font-bold">
                    Chat with Us
                </div>

                <div className="h-96 overflow-y-auto p-4 space-y-4" id="chat-box">

                    <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300"></div>
                        <div className="bg-gray-100 p-3 rounded-lg shadow text-sm text-gray-700">
                            Hello! How can I assist you today?
                        </div>
                    </div>


                    <div className="flex items-end justify-end space-x-2">
                        <div className="bg-blue-500 text-white p-3 rounded-lg shadow text-sm max-w-xs">
                            I have a question about your services.
                        </div>
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300"></div>
                    </div>
                </div>


                <div className="border-t p-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
