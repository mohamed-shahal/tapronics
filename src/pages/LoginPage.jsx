import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
export default function LoginPage(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errorText,setErrorText] = useState('');
    const navigate = useNavigate();

    ////////////////////////////////////////
    const handleLogin = () => {
        loginUser(email,password);
    }
    const loginUser = async (email, password) => {
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if(user.emailVerified){
                setErrorText("logined");
                navigate("/profile",{ state:{user: user.uid}});
            }
            else{
                setErrorText("Email not Verified");
            }
        }
        catch (error){
            setErrorText("Invalid Credentials");
        }
    }
    return(
        <>
        <div className="w-screen h-screen bg-green-400 relative flex justify-center items-center">
            <div className="bg-white p-5 text-black gap-5 flex flex-col justify-center items-center w-70 sm:w-80 h-auto rounded-xl">
                <p className="text-4xl">Login</p>
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="email" placeholder="Enter Your Email " value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="password" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)}  />
                <div className="flex justify-end w-[100%]">
                <p className="text-red-600">{errorText}</p>
                </div>
                <div className="flex justify-between w-[100%]">
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value="Register" onClick={() => navigate("/register")}/>
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value="Login" onClick={handleLogin}/> 
                </div>
                <GoogleLoginButton />
            </div>
        </div>
        </>
    )
}