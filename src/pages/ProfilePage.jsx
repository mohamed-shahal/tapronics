import { useRef, useState, useEffect } from "react"
import LogoutIcon from "../components/LogoutIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs,getDoc, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase"; // adjust path if needed
import axios from "axios";
export default function ProfilePage(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errorText,setErrorText] = useState('');
    const fileInput = useRef(null);
    const [fileName,setFileName] = useState("");
    const [file,setFile] = useState(null);
    const [url,setUrl] = useState("");
    const navigate = useNavigate();
    const [saveState,setSaveState] = useState("Save");
    const [refresh, setRefresh] = useState(false);
    ///////////////////////////////////////
    const [formData, setFormData] = useState({
        fullName: "",
        dpUrl: "",
        role: "",
        email: "",
        mobile: "",
        whatsapp: "",
        instagram: "",
        xUsername: "",
        linkedin: "",
        website: ""
    });
    const location = useLocation();
    const {user} = location.state || {};

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userRef = doc(db, "users", user); // single document ref
                const docSnap = await getDoc(userRef); // use getDoc instead of getDocs
    
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        fullName: data.Name || "",
                        dpUrl: data.dpUrl || "",
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
    }, [user]);
    
    const handleLogout = async () => {
        try{
            await signOut(auth);
            navigate("/login");
        } catch(error){
            setErrorText("Error in Logout")
        }
    }
    let imageUrl = "";
    const handleSave = async () => {
        try{
            if(!user){
                setErrorText("User not Found")
                return;
            }

            const uploadData = new FormData();
            uploadData.append("file", file)
            uploadData.append("upload_preset", "unsigned_react_preset"); // replace this 
            uploadData.append("cloud_name", "dwqcjnvrb"); // replace this
setSaveState("Saving...")
            try {
                const response = await axios.post(
                  "https://api.cloudinary.com/v1_1/dwqcjnvrb/image/upload", // replace this
                  uploadData
                );
                const uploadedUrl = response.data.secure_url;
                imageUrl = uploadedUrl;
                setFormData(prev => ({ ...prev, dpUrl: uploadedUrl }));
    } catch (error) {
      console.error("Image upload failed:", error);
    }


            const userRef = doc(db, "users", user);
            await setDoc(userRef, {
                Name: formData.fullName,
                dpUrl:imageUrl,
                role: formData.role,
                Email: formData.email,
                Mobile: formData.mobile,
                Whatsapp: formData.whatsapp,
                Instagram: formData.instagram,
                X: formData.xUsername,
                Linkedin: formData.linkedin,
                Website: formData.website,
              }, { merge: true });
              setErrorText("Saved");
              
        }
        catch(error){
            console.log(error)
        }
        setSaveState("Save")
        setRefresh(prev => !prev);
    }
        
    ////////////////////////////////////////
    const uploadFile = () => {
        fileInput.current.click();
    }
    const handleChange = (e) => {
        if(e.target.files.length > 0){
            setFileName(e.target.files[0].name);
            setFile(e.target.files[0]);
        }
    };
    return(
        <>
        <div className="logout p-5 w-screen bg-white md:bg-green-400 flex justify-end">
        <LogoutIcon onClick={handleLogout} className="text-black md:text-white cursor-pointer" />  {/* Red color */}
 
        </div>
        <div className="w-screen h-screen bg-white md:bg-green-400 relative flex justify-center items-center">
            <div className="bg-white p-5 text-black gap-5 flex flex-col justify-center items-center w-150 sm:w-200 h-auto rounded-xl text-sm">
                <div className="dp flex justify-start items-center w-[100%] h-auto gap-3">
                    <img className="rounded-full w-20 h-20 object-cover sm:w-25 sm:h-25 " src={formData.dpUrl || "https://nursinginstitutegoa.org/wp-content/uploads/2016/01/tutor-8.jpg"} alt=""  />
                    <input className="border-black border-1 p-2 rounded w-[60%] h-8 leading-4" type="button" value="Select an Image" onClick={uploadFile} />
                    <input type="file" ref={fileInput} className="hidden" onChange={handleChange} />
                    <p>{fileName} {url}</p>
                </div>
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}   />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}   />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="email" placeholder="Enter Your Email " value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="Mobile Number with Country Code" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="Whatsapp Number with Country Code" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="Instagram Username" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="X username" value={formData.xUsername} onChange={(e) => setFormData({...formData, xUsername: e.target.value})} />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="Linkedin username" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})}  />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="Your Website URL" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
                <div className="flex justify-end w-[100%]">
                <p className="text-red-600">{errorText}</p>
                </div>
                <div className="flex justify-end w-[100%]">
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value={saveState} onClick={handleSave}/>
                </div>
            </div>
        </div>
        </>
    )
}