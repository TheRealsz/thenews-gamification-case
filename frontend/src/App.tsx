import { UserProvider } from "./contexts/user-context"
import { Router } from "./router"
import { ToastContainer } from 'react-toastify';


function App() {

  return (
    <UserProvider>
      <Router />
      <ToastContainer />
    </UserProvider>
  )
}

export default App
