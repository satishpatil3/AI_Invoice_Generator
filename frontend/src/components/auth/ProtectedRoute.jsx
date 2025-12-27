import { Navigate,Outlet } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import { useAuth } from "../../context/AuthContext"

const ProtectedRoute = ({children}) => {
    const{isAuthenticated ,loading}=useAuth();

    if(loading){
        return <div>Loading ...</div>
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

  return (
    <div>
      <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>
    </div>
  )
}

export default ProtectedRoute
