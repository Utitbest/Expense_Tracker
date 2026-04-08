import { useState } from "react";
import { toast } from "sonner";


export function useResetPassword(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const ResetPassword = async(formData)=>{
        setLoading(true)
        setError(null)
        const loadingToast = toast.loading("Reseting Password...");
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed please try again!");
            }
            toast.success("Password Reset Successfully!", {
                id: loadingToast
            })
            return { success: true, data };   

        } catch (err) {
            setError(err.message)
            toast.error(err.message, {
                id: loadingToast,
            })
            return { success: false, error: err.message };
        }finally{
            setLoading(false)
        }
    }

    return {
        loading,
        ResetPassword,
        setError,
        error
    }
}