import { useChat } from 'ai/react'
import { useParams } from 'react-router';
import Markdown from 'react-markdown'

export default function ChatInterface() {
  const { id } = useParams();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: "/api/" + id })

  return (
    <div className="flex flex-col max-w-2xl mx-auto p-4 h-full">
      <h1 className="text-2xl font-bold mb-4">Chat with your book</h1>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              } max-w-[80%]`}
          >
            <p className="text-sm font-semibold mb-1">
              {message.role === 'user' ? 'You' : 'AI'}
            </p>
            <Markdown>{message.content}</Markdown>
          </div>
        ))}
        {isLoading && <div>Thinking...</div>}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex space-x-2 p-2 border-t border-gray-300 bg-white sticky bottom-0"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          Send
        </button>
      </form>
    </div>
  )
}
