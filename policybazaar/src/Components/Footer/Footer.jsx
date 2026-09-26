import FooterPlans from "./FooterPlans"
import "./Footer.css"

import FooterMid from "./FooterMid"
import FooterEnd from "./Footerend"

const Footer = () => {
    return (
        <>
        <div id="footercont">
            <div id="footerchild">
                <div style={{marginBottom:"30px"}}>
                    <h2>Our Insurance Offerings</h2>
                </div>
                <div id="footerinsurance">
                    <FooterPlans />
                </div>
                <div id="tc">
                    <p>*Standard Plans Terms and Conditions apply</p>
                    <p>+For insurance plans that do not require inspection of your premises</p>
                    <p>#The above returns are based on the past performance of 7 years</p>
                    <p>*As per Draft Notification No. RT-11036/194/2021-MVL (Govt. of India, Ministry of Road Transport and Highways)</p>
                    <p>*STANDARD TERMS AND CONDITIONS APPLY. For more details on risk factors, terms and conditions, please read the sales brochure carefully before concluding a sale.</p>
                </div>
            </div>
        </div>
        <div id="footermidpart">
            <FooterMid />
        </div>
        <div id="footercont">
            <div id="footerchild" >
                <FooterEnd />
            </div>
            <div id="tc" style={{textAlign:"center",color:"#585858"}}>
                <p>**Discount is offered by the Insurance company as approved by IRDAI for the product under File & Use guidelines</p> 
                <p>#On the basis of your profile</p>
                <p>SafeLife Insurance Brokers Private Limited | CIN: U74999HR2014PTC053454 | Registered Office - Plot No.119, Sector - 44, Gurgaon, Haryana - 122001 Tel no. : 0124-4218302 Email ID: enquiry@safelife.com</p>
                <p>Contact Us | Legal and Admin Policies</p>
                <p>SafeLife is registered as a Direct Broker | Registration No. 742, Registration Code No. IRDA/ DB 797/ 19, Valid till 09/06/2026, License category- Direct Broker (Life & General)| Visitors are hereby informed that their</p>
                <p>information submitted on the website may be shared with insurers. Product information is authentic and solely based on the information received from the insurers.</p>
                <p>© Copyright 2008-2026 safelife.com. All Rights Reserved.</p>
            </div>
        </div>
        </>
    )
}

export default Footer;