import GoogleIcon from "./GoogleIcon";
import { auth, provider, db } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Using async/await for sign-in
      const user = result.user;
      const isNewUser = result._tokenResponse?.isNewUser;

      if (isNewUser) {
        console.log("New user signed up:", user);
        // Create user document in Firestore with additional fields
        await setDoc(doc(db, "users", user.uid), {
          Name: user.displayName, // Name fetched from Google
        });
      } else {
        console.log("Returning user logged in:", user);
      }

      // Navigate to profile page
      navigate("/profile", { state: { user: user.uid } });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      className="bg-white border-1 flex items-center p-2 gap-2 rounded-xl cursor-pointer"
      onClick={handleGoogleLogin}
    >
      <GoogleIcon className="w-10 h-auto" />
      <b>Continue with Google</b>
    </div>
  );
}
