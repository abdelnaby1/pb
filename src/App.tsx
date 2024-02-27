import { Toaster } from 'react-hot-toast';
import './App.css'

import router from './router';
import { RouterProvider } from 'react-router-dom';


function App() {
 
  return (
    <main className='container'>
      <RouterProvider router={router} />
      <Toaster />
    </main>
    
  )
}

export default App
