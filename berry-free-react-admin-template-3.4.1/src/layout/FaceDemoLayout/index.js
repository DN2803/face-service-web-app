import Header from "layout/FaceDemoLayout/Header"
import SilderBar from "layout/FaceDemoLayout/Sidebar"
import { Outlet } from "react-router"
const FaceDemoLayout = () => {
    return (
        <>
        <Header/>
        <SilderBar/>
        <Outlet/>
        </>
    )
}
export default FaceDemoLayout