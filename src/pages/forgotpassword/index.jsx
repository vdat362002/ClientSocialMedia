import React, { useState, useEffect } from "react";
import { forgotPassword, sendOtp, verifyOtp } from "../../services/api";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const history = useHistory();

  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleSendOtp = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    sendOtp({ email })
      .then((res) => {
        setStep(2);
        setResendTimer(60);
        toast.success("OTP sent successfully!");
      })
      .catch((err) => {
        toast.error("Failed to send OTP. Please try again.");
      });
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      sendOtp({ email })
        .then((res) => {
          setResendTimer(60);
          toast.success("OTP resent successfully!");
        })
        .catch((err) => {
          toast.error("Failed to resend OTP. Please try again.");
        });
    }
  };

  const handleConfirmOtp = () => {
    verifyOtp({ email, otp })
      .then((res) => {
        setStep(3);
        toast.success("OTP verified successfully!");
      })
      .catch((err) => {
        toast.error("Invalid OTP. Please try again.");
      });
  };

  const handleResetPassword = () => {
    if (password.length < 8) {
      toast.error("Passwords min length of 8.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    forgotPassword({ email, password, otp })
      .then((res) => {
        toast.success("Password has been reset successfully!");
        history.push("/login");
      })
      .catch((err) => {
        toast.error("Failed to reset password. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg mb-2"
              onClick={handleConfirmOtp}
            >
              Confirm OTP
            </button>
            <button
              className="w-full bg-gray-500 text-white py-2 rounded-lg"
              onClick={handleResendOtp}
              disabled={resendTimer !== 0}
            >
              Resend OTP ({resendTimer}s)
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
