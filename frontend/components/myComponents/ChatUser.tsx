import React from 'react'

function ChatUser() {
    return (
        <div>
            <div className="max-w-sm mx-auto mt-40">
                <div className="p-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200">
                    <div className="flex items-center">
                        <img className="rounded-full h-10 w-10" src="https://loremflickr.com/g/600/600/girl" />
                        <div className="ml-2 flex flex-col">
                            <div className="leading-snug text-sm text-gray-900 font-bold">Jane doe</div>
                            <div className="leading-snug text-xs text-gray-600">@jane</div>
                        </div>
                    </div>
                    <button className="h-8 px-3 text-md font-bold text-blue-400 border border-blue-400 rounded-full hover:bg-blue-100">Follow</button>
                </div>
                <div className="p-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200">
                    <div className="flex items-center">
                        <img className="rounded-full h-10 w-10" src="https://loremflickr.com/g/600/600/boy" />
                        <div className="ml-2 flex flex-col">
                            <div className="leading-snug text-sm text-gray-900 font-bold">john doe</div>
                            <div className="leading-snug text-xs text-gray-600">@john</div>
                        </div>
                    </div>
                    <button className="h-8 px-3 text-md font-bold text-blue-400 border border-blue-400 rounded-full hover:bg-blue-100">Follow</button>
                </div>
                <div className="p-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200">
                    <div className="flex items-center">
                        <img className="rounded-full h-10 w-10" src="https://loremflickr.com/g/600/600/paris/" />
                        <div className="ml-2 flex flex-col">
                            <div className="leading-snug text-sm text-gray-900 font-bold">Paris</div>
                            <div className="leading-snug text-xs text-gray-600">@paris</div>
                        </div>
                    </div>
                    <button className="h-8 px-3 text-md font-bold text-blue-400 border border-blue-400 rounded-full hover:bg-blue-100">Follow</button>
                </div>
            </div>
        </div>
    )
}

export default ChatUser
