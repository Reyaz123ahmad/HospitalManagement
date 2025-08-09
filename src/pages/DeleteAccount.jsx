import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DeleteAccount = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const deleteUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No token found. Please log in again.");
          navigate("/login");
          return;
        }

        const response = await axios.delete("http://localhost:3000/api/v1/auth/delete-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          alert("Account deleted successfully");

          // Clear token from localStorage
          localStorage.removeItem("token");

          // Redirect to signup page
          navigate("/signup");
        } else {
          alert(response.data.message || "Failed to delete account");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Something went wrong. Please try again.");
      }
    };

    deleteUser();
  }, [navigate]);

  return null; // You can show a spinner or message if you want
};

export default DeleteAccount;

