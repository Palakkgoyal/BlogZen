import './App.css'

import { Route, Routes } from "react-router-dom";
import { Layout, Home, Profile, Draft } from "./pages"

function App() {

  return (
    <Routes>
      <Route path="/" element={ <Layout /> }>
        <Route index element={ <Home /> } />
        <Route path="/profile" element={ <Profile /> } />
        <Route path="/draft" element={ <Draft /> } />
        <Route path="*" element={ <p>Not Found</p> } />
      </Route>
    </Routes>
  )
}

export default App




    // async function createUser() {
    //   const name = "Palakg"
    //   const email = "tester@gmail.com"
    //   try {
    //     await fetch(`https://accurate-aquamarine.cmd.outerbase.io/createUser`, {
    //       method: "POST",
    //       headers: {
    //         "content-type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         name: name,
    //         email: email,
    //       }),
    //     });
  
    //     console.log("Done")
    //   } catch (error) {
    //     console.error(error, "err")
    //   }
    // }
