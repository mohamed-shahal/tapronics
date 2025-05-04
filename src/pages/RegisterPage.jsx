import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
export default function RegisterPage(){
    const [step,setStep] = useState(0);
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [rePassword,setRePassword] = useState('');
    const [errorText,setErrorText] = useState('');
    let Name = firstName +" "+ lastName;
    const navigate = useNavigate();
    const [infoText,setInfoText] = useState("");

    
    //check email availability
    const checkEmailAvailabilty = async (email) => {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", email))

        try{
            const querySnapShot = await getDocs(q);
            if(querySnapShot.empty){
                return true;
            } else {
                return false;
            }
        } catch(error){
            console.error("Error in Checking Email")
            setErrorText("Error in Checking Email")
        }
    }

    
    //check email
    function checkEmail(email){
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
    //check password
    function checkPasswordStrength(Password){
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(Password)
        const hasUpperCase = /[A-Z]/.test(Password)
        const isLength = Password.length >= 4;
        return hasSymbol && hasUpperCase && isLength;
    }
    ////////////////////////////////////////
    const stepForward = async () => {
        if (step == 0){
            if(firstName === '' || lastName === ''){
                setErrorText("Please Fill the Fields")
            }
            else{
                setStep(step+1);
            }
        }
        if (step == 1){
            if(!email){
                setErrorText("Please Fill the Fields")
            }
            else if(checkEmail(email) == false){
                setErrorText("Not a Valid Email")
            }
            else{
                setStep(step+1);
            }
        }
        if (step == 2){
            if(!(password || rePassword === 0)){
                setErrorText("Please give a Password")
            }
            else if(!(password === rePassword)){
                setErrorText("Passwords Don't Match")
            }
            else if(checkPasswordStrength(password) === false){
                setErrorText("Password is too Weak")
            }
            else{
                try{
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    await setDoc(doc(db, "users", user.uid),{
                        Name,
                    });

                    
                    await sendEmailVerification(user);
                    setStep(step+1);
                    setInfoText(`Your account has been created. A verification email has been sent — please check your inbox and verify your email before logging in.`);
                }
                catch(error){
                    if(error.code === "auth/email-already-in-use"){
                        setErrorText("Email is Already Taken");
                    }
                    else {
                        setErrorText(`${error}`);
                    }
                }
                
                
            }
        }
        
    }
    const stepBackward = () => {
        setErrorText("")
        setStep(step-1);
    }
    return(
        <>
        <div className="w-screen h-screen bg-green-400 relative flex justify-center items-center">
            <div className="bg-white p-5 text-black gap-5 flex flex-col justify-center items-center w-70 sm:w-80 h-auto rounded-xl">
                {/* first name and last name */}
                {step === 0 && (
                    <>
                <p className="text-4xl">Register</p>
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="Enter Your First Name " value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="text" placeholder="Enter Your Second Name " value={lastName} onChange={(e) => setLastName(e.target.value)}  />
                <div className="flex justify-end w-[100%]">
                <p className="text-red-600">{errorText}</p>
                </div>
                <div className="flex justify-between w-[100%]">
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value="Login" onClick={() => navigate("/login")} />
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value="Next" onClick={() => stepForward()} />
                </div>
                </>
                )}
                {/*end of  first name and last name */}
                {/* email */}

                {step === 1 && (
                    <>
                <p className="text-4xl">Register</p>
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="email" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <div className="flex justify-end w-[100%]">
                <p className="text-red-600">{errorText}</p>
                </div>
                <div className="flex justify-between w-[100%]">
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value="Back" onClick={() => stepBackward()} />
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value="Next" onClick={() => stepForward()} />
                </div>
                </>
                )}

                {/* end of email */}
                {/* password */}

                {step === 2 && (
                    <>
                <p className="text-4xl">Register {step}</p>
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="password" placeholder="Choose a Password " value={password} onChange={(e) => setPassword(e.target.value)} />
                <input className="border-black border-1 p-2 rounded w-[100%] h-8" type="password" placeholder="Re Enter Password " value={rePassword} onChange={(e) => setRePassword(e.target.value)} />
                <div className="flex justify-end w-[100%]">
                <p className="text-red-600">{errorText}</p>
                </div>
                <div className="flex justify-between w-[100%]">
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value="Back" onClick={() => stepBackward()} />
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value="Next" onClick={() => stepForward()} />
                </div>
                </>
                )}

                {/* end of password */}
                {/* otp */}

                {step === 3 && (
                    <>
                <p className="text-xl">{infoText}</p>
                <div className="flex justify-end w-[100%]">
                <input className="bg-green-400 px-4 py-2 rounded" type="button" value="Login" onClick={() => navigate("/login")}  />
                </div>
                </>
                )}

                {/* end of otp */}
            </div>
        </div>
        </>
    )
}