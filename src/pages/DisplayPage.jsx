import LogoIcon from "../components/Logo"
import SaveIcon from "../components/SaveIcon"
import CallIcon from "../components/CallIcon"
import MailIcon from "../components/MailIcon"
import WhatsAppIcon from "../components/WhatsAppIcon"
import InstaIcon from "../components/InstaIcon"
import XLogo from "../components/XLogo"
import LinkedinIcon from "../components/LinkedinIcon"
import WebIcon from "../components/WebIcon"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { collection, query, where, getDocs,getDoc, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
export default function DisplayPage(){
    const [errorText,setErrorText] = useState("");
    const {uid} = useParams();
    const navigate = useNavigate();
    ///////////////////////////////////////
    const [formData, setFormData] = useState({
        fullName: "",
        role: "",
        dpUrl: "",
        email: "",
        mobile: "",
        whatsapp: "",
        instagram: "",
        xUsername: "",
        linkedin: "",
        website: ""
    });
    //////////////////////////////
    useEffect(() => {
        async function fetchUserData() {
            try {
                const userRef = doc(db, "users", uid); // single document ref
                const docSnap = await getDoc(userRef); // use getDoc instead of getDocs
    
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        fullName: data.Name || "",
                        dpUrl:data.dpUrl || "",
                        role: data.role || "",
                        email: data.Email || "",
                        mobile: data.Mobile || "",
                        whatsapp: data.Whatsapp || "",
                        instagram: data.Instagram || "",
                        xUsername: data.X || "",
                        linkedin: data.Linkedin || "",
                        website: data.Website || "",
                    });
                } else {
                    setErrorText("User Not Found");
                }
            } catch (error) {
                setErrorText("Error fetching data: " + error.message);
            }
        }
    
        fetchUserData(); // ⬅️ call it inside useEffect
    }, [uid]);

    const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${formData.fullName}
TEL;TYPE=CELL:${formData.mobile}
EMAIL:${formData.email}
URL:${formData.website}
LINKEDIN:${formData.linkedin}
END:VCARD
`;
const [vcardUrl, setVcardUrl] = useState(null);

useEffect(() => {
  if (formData.fullName) {
    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    setVcardUrl(url);
  }
}, [formData]);

    
    return(
        <>
        <div className="flex flex-col w-screen h-screen bg-white justify-between items-center">
            <div className="bg-green-400 w-full h-auto rounded-b-3xl"><LogoIcon className='w-40 ml-10' /></div>
            <div className="flex w-[100%] p-10 h-auto  justify-center  gap-5 text-black items-center">
                <img className="rounded-full ml-5 w-30 h-30 object-cover" src={formData.dpUrl} alt="" />
                <div className="name  flex flex-col">
                    <p className="text-xl"><b>{formData.fullName}</b></p>
                    <p className="text-lg">{formData.role}</p>
                </div>
            </div>
            


            {/* buttons */}
            <div className="buttons w-100 h-auto flex justify-center gap-2 text-black">
            
            {vcardUrl && (
  <a
    href={vcardUrl}
    download={`${formData.fullName}.vcf`}
    className=" bg-white w-auto h-auto px-4 py-2 shadow-2xl border border-black text-black text-xl rounded-2xl flex items-center gap-3"
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    Save
    <SaveIcon className="w-6 h-6 text-black" />
  </a>
)}


            <button className="bg-white w-auto h-auto px-4 py-2 shadow-2xl border border-black text-black text-xl rounded-2xl flex items-center gap-3" onClick={() => window.open(`tel:${formData.mobile}`)}>
                 Call
                 <CallIcon className="w-6 h-6 text-black" />
            </button>

            <button className="bg-white w-auto h-auto px-4 py-2 shadow-2xl border border-black text-black text-xl rounded-2xl flex items-center gap-3" onClick={() => window.open(`mailto:${formData.email}`)}>
                 Mail
                 <MailIcon className="w-6 h-6 text-black" />
            </button>
            </div>

{/* body part */}

<div className="w-full text-black h-auto  flex justify-center">
<div className="white-box w-90 h-auto bg-white border-1 flex flex-col gap-5 p-5 rounded-3xl shadow-xl">
    <div className=" flex  w-auto h-auto justify-start items-center gap-5 cursor-pointer" onClick={() => window.open(`https://wa.me/${formData.whatsapp}`)}>
        <WhatsAppIcon className="w-10 h-auto" />
        <p>{formData.whatsapp}</p>
    </div>
    <div className=" flex  w-auto h-auto justify-start items-center gap-5 cursor-pointer" onClick={() => window.open(`https://instagram.com/${formData.instagram}`)}>
        <InstaIcon className="w-10 h-auto" />
        <p>{formData.instagram}</p>
    </div>
    <div className=" flex  w-auto h-auto justify-start items-center gap-5 cursor-pointer" onClick={() => window.open(`https://x.com/${formData.xUsername}`)}>
        <XLogo className="w-10 h-auto" />
        <p>{formData.xUsername}</p>
    </div>
    <div className=" flex  w-auto h-auto justify-start items-center gap-5 cursor-pointer" onClick={() => window.open(`https://linkedin.com/in/${formData.linkedin}`)}>
        <LinkedinIcon className="w-10 h-auto" />
        <p>{formData.linkedin}</p>
    </div>
    <div className=" flex  w-auto h-auto justify-start items-center gap-5 cursor-pointer" onClick={() => window.open(formData.website)}>
        <WebIcon className="w-10 h-auto" />
        <p>{formData.website}</p>
    </div>
</div>
</div>



<div className="bg-green-400 w-full h-auto rounded-t-3xl flex flex-col justify-center items-center p-5">
    <LogoIcon className='w-20 h-auto ' />
    <p>© Tapronics. All rights reserved.</p>
    </div>

        </div>
        </>
    )
}