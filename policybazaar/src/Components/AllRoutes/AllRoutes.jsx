import { Route, Routes } from "react-router-dom";
import FinalCheckout from "../FinalCheckout/Checkout";
import OTP from "../FinalCheckout/OTP";
import Login from "../Login/LoginComp/Login";
import Data from "../Navbar/Data";
import { ChakraProvider } from "@chakra-ui/react";
import HomePage from "../Home/Home";
import { Family } from "../Product_page/Family_page/Family";
import { Family_right } from "../Product_page/Family_page/Family_right";
import { Page2 } from "../Product_page/Page_2/Page2";
import { Page3 } from "../Product_page/Page_3/Page3";
import { Page4 } from "../Product_page/Page_4/Page4";
import { Display_data } from "../Product_page/data/Display_data";
import { Product } from "../Product_page/Insurance_page/Product";
import Payment from "../Payment/Payment";
import RenewalPortal from "../Portals/RenewalPortal";
import ClaimPortal from "../Portals/ClaimPortal";
import SupportPortal from "../Portals/SupportPortal";
import AdminPanel from "../Admin/AdminPanel";
import AdminLogin from "../Admin/AdminLogin";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Admin Authentication & Control Center */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/:tab" element={<AdminPanel />} />
        
        {/* Health Insurance Flow */}
        <Route path="/health" element={<Family />}>
          <Route index element={<Family_right />} />
          <Route path="health" element={<Family_right />} />
          <Route path="age" element={<Page2 />} />
          <Route path="pincode" element={<Page3 />} />
          <Route path="contact" element={<Page4 />} />
        </Route>

        {/* Life Insurance & Term Flow */}
        <Route path="/plans" element={<Display_data />} />
        <Route path="/term" element={<Product />} />

        {/* Renewal Portal Routes */}
        <Route path="/renewal" element={<RenewalPortal />} />
        <Route path="/renewal/:type" element={<RenewalPortal />} />

        {/* Claims Assistance Portal Routes */}
        <Route path="/claim" element={<ClaimPortal />} />
        <Route path="/claim/:action" element={<ClaimPortal />} />

        {/* Customer Support Portal Routes */}
        <Route path="/support" element={<SupportPortal />} />
        <Route path="/support/*" element={<SupportPortal />} />

        {/* Dynamic routes for dealt insurance providers */}
        {Data.LifeInsurance.map((ele, i) => (
          <Route key={`life-${i}`} path={`/lifeinsurance/${ele.path}`} element={<Display_data />} />
        ))}
        {Data.HealthInsurance.map((ele, i) => (
          <Route key={`health-${i}`} path={`/healthinsurance/${ele.path}`} element={<Family />} />
        ))}
        {Data.GeneralInsurance.map((ele, i) => (
          <Route key={`gen-${i}`} path={`/generalinsurance/${ele.path}`} element={<Product />} />
        ))}

        {/* Checkout, OTP & Payment */}
        <Route path="/checkout" element={<FinalCheckout />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/payment" element={<Payment />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            <ChakraProvider>
              <Login />
            </ChakraProvider>
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
