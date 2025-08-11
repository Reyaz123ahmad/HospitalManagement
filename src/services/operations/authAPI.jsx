//import axios from "axios"
import axiosInstance from "../../utils/axiosInstance"
import toast from "react-hot-toast"

export function login(email, password, navigate) {
  return async () => {
    const toastId = toast.loading("Logging in...")

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response.data)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")

      const user = response?.data?.user
      const userImage = user?.image
        ? user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`

      const userWithImage = {
        ...user,
        image: userImage,
      }

      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify(userWithImage))
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("accountType", user.accountType)  // ✅ This is the fix

      // ✅ Navigate to dashboard
      navigate("/dashboard")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      const message = error.response?.data?.message || "Login Failed"
      toast.error(message)
    } finally {
      toast.dismiss(toastId)
    }
  }
}
