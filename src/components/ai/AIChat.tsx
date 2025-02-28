import { useState, useRef, FormEvent } from 'react';
import { callBedrockAI, BEDROCK_MODELS } from '../../utils/bedrockAI';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await callBedrockAI({
        prompt: [{ type: 'text', text: input }],
        modelId: BEDROCK_MODELS.CLAUDE_SONNET_3_7,
        maxTokens: 1000,
        temperature: 0.7,
        topK: 250,
        topP: 0.999
      });
      
      if (response.error) {
        setError(`Error: ${response.error}. ${response.details || ''}`);
      } else {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.result || 'No response received',
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      setError('Failed to get response from AI');
      console.error(err);
    } finally {
      setIsLoading(false);
      // Scroll to bottom after state updates
      setTimeout(scrollToBottom, 100);
    }
  };
  
  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg shadow-md">
      <div className="p-4 bg-blue-600 text-white font-bold rounded-t-lg">
        AI Assistant (Claude 3.7)
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-100 ml-8' 
                  : 'bg-gray-100 mr-8'
              }`}
            >
              <div className="font-semibold mb-1">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex items-center justify-center p-3 rounded-lg bg-gray-100 mr-8 mb-4">
            <div className="font-semibold mb-1">AI Assistant</div>
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
        
        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-800 mb-4">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 