import { useState } from "react";
import { toast } from "sonner";


export function ExpenseFetch(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const AddExpense = async(formData)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add expense");
            }

            return { success: true, data };   

        } catch (err) {
            setError(err.message)
            console.log(err.message)
            toast.error(err.message)
            return { success: false, error: err.message };
        }finally{
            setLoading(false)
        }
    }

    return {
        loading,
        AddExpense,
        error
    }
}