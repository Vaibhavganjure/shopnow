import {Outlet} from "react-router-dom"
import MyNavBar from "./MyNavBar"
import Footer from "./Footer"

const RootLayout = () => {
  return (
    <main>
      <MyNavBar/>
    <div>
      <Outlet/>
    </div>
    <Footer/>
    </main>
  )
}

export default RootLayout
