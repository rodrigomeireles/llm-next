'use client'

import { useChat, Message } from 'ai/react'
import { useRef, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ClipboardIcon, CheckIcon } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '')
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return !inline && match ? (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-md text-black-200 transition-colors"
      >
        {copied ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
      </button>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

export function Page() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [title, setTitle] = useState("LLM Client")
  const [hasFirstExchange, setHasFirstExchange] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length === 3 && !hasFirstExchange) {
      setHasFirstExchange(true)
      getTitle(messages)
    }
  }, [messages, hasFirstExchange])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const getTitle = async (messages: Message[]) => {
    const msgs: Object[] = [];
    messages.forEach((m) => msgs.push({
      role: m.role,
      content: m.content
    }));
    const response = await fetch('/api/title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          ...msgs,
          {
            role: 'user',
            content: 'Based on our conversation, suggest a short and concise title for this chat (max 5 words).',
          },
        ],
      }),
    })
    const data = await response.json();
    setTitle(data.choices[0].message.content);
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto h-screen text-black-100">
      <h1 className="text-2xl font-bold text-center mb-4 pt-6">{title.replaceAll("\"", "")}</h1>

      <div className="flex-grow overflow-auto scrollbar-hide mb-4 px-4">
        {messages.map(m => (
          <div key={m.id} className="mb-4">
            <strong className="text-black-300">{m.role === 'user' ? 'User: ' : 'AI: '}</strong>
            <ReactMarkdown
              components={{
                code: CodeBlock
              }}
            >
              {m.content}
            </ReactMarkdown>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="sticky bottom-0 w-full max-w-3xl p-4 border-t border-gray-700">
        <TextareaAutosize
          ref={textareaRef}
          className="w-full p-2 mb-2 text-gray-700 border border-gray-600 rounded focus:outline-none focus:border-gray-500 placeholder-gray-400 resize-none overflow-y-auto scrollbar-hide"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          minRows={1}
          maxRows={10}
        />
        <button
          type="submit"
          className="w-full px-4 py-2 text-black-600 rounded hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}