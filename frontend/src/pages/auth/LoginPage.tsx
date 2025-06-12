import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router";
import Toast from "../../components/Toast.js";
import { loginUser } from "../../services/authService.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const displayToast = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowToast(false);

    try {
      const res = await loginUser({ email, password });
      const user = res.user;

      if (!user.emailVerified) {
        displayToast("Please verify your email before logging in.", "error");
        setIsLoading(false);
        return;
      }

      displayToast("Login successful!", "success");
      const causeCode = localStorage.getItem('support-cause-code');
      if (causeCode) {
        localStorage.removeItem('support-cause-code');
        navigate(`/cause/${causeCode}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Invalid credentials or server error.";
      displayToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-4 font-host"
    >
      <p className="text-gray-dark dark:text-gray-100 text-2xl">Welcome Back!</p>

      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="account-txt text-dark dark:text-gray-300 text-sm mt-1">
          You don't have an account?{" "}
          <Link to="/auth/sign-up" className="underline text-accent-green">
            Sign up
          </Link>
        </p>
      </div>

      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">Password</label>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <EyeSlashIcon className="size-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <EyeIcon className="size-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>
        <p className="text-sm mt-1">
          <Link to="/auth/forgot-password" className="underline text-accent-green">
            Forgot password?
          </Link>
        </p>
      </div>

      <button
        type="submit"
        className={`flex items-center justify-center bg-accent-green text-white w-full font-medium py-2 px-6 rounded-lg hover:scale-95 duration-300 ${isLoading ? "opacity-50" : ""
          }`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Login"}
      </button>

      {showToast && (
        <Toast message={message} type={toastType} onClose={() => setShowToast(false)} />
      )}
    </form>
  );
}
