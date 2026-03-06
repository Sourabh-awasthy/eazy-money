"use client";

import axios from "axios";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { useState } from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext"; 

export default function Signup() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, { email, password });
            
            const token = response.data.token;
            
            login(token);
            
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
    };

    return (
        <>
            <NavBar />  
            <div className="flex flex-col items-center">
                <h1 className="text-2xl text-center m-8">
                    Signup
                </h1>

                <form className="flex flex-col items-center mt-4" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email"
                        className="border border-gray-300 rounded p-2 mb-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 rounded p-2 mb-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2 w-64 hover:bg-blue-600 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>

                <Link className="mt-4 text-blue-500 hover:text-blue-700 underline flex justify-center transition-colors" href={"/login"}>
                    Already have an account? Log In
                </Link>
            </div>
        </>
    );
}