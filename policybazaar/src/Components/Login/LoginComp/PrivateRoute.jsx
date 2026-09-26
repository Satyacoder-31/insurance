import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isAuth = useSelector((store) => store?.login?.isAuth) ?? (JSON.parse(sessionStorage.getItem("loggedInUserInfo"))?.isAuth ?? false);

  if (!isAuth) {
    return <Navigate to={"/login"} />;
  }
  return children;
}
export default PrivateRoute;
