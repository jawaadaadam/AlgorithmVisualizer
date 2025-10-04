import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './index.css' // make sure Tailwind CSS is imported

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex space-x-4 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="w-20 h-20" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-20 h-20" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-blue-500 mb-4">
        Tailwind is working!
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-2 text-gray-700">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
