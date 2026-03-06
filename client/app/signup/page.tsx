"use client";
import axios from "axios";
import { useRouter } from "next/dist/client/components/navigation";
import Link from "next/link"
import { useState } from "react";

export default function Signup() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/api/auth/register`, { email, password });
            const token = response.data.token;
            localStorage.setItem("eazyToken", token);
            alert("Signup successful!");
            router.push("/");
        } 
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const statusCode = error.response.status; 
                
                const backendMessage = error.response.data.message; 

                if (statusCode === 400) {
                    alert(backendMessage); 
                }
            } else {
                console.error("A non-Axios error occurred:", error);
            }
        }
    }
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl text-center m-8">
                Signup
            </h1>

            <form className="flex flex-col items-center mt-4">
                <input 
                    type="email" 
                    placeholder="Email"
                    className="border border-gray-300 rounded p-2 mb-4 w-64"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 rounded p-2 mb-4 w-64"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    type="submit"
                    className="bg-blue-500 text-white rounded p-2 w-64"
                    onClick={handleSubmit}
                >
                    Sign Up
                </button>
            </form>

            <Link className="mt-4 text-blue-500 underline flex justify-center" href={"/login"}>
                Already have an account? Log In
            </Link>
        </div>
    )
}