import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Chat from "./component/Chat";
import AddQa2 from "./component/AddQa2";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import UserProtectedRoute from "./component/ProtectedRoute/userProtectedRoute";

const apiUrl = import.meta.env.VITE_API;

const NotFound = () => (
    <section className="flex items-center h-full p-16 dark:bg-gray-50 dark:text-gray-800">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
            <div className="max-w-md text-center">
                <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
                    <span className="sr-only">Error</span>404
                </h2>
                <p className="text-2xl font-semibold md:text-3xl">
                    Sorry, we couldn't find this page.
                </p>
                <a
                    href="/"
                    className="px-8 py-3 font-semibold rounded dark:bg-default-600 dark:text-gray-50"
                >
                    Back to homepage
                </a>
            </div>
        </div>
    </section>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center fixed inset-0 bg-white bg-opacity-50 z-50">
        <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
    </div>
);

const RoutingContent = ({ isAuthenticated, isLoading, setIsLoading }) => {

    const location = useLocation();

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleComplete = () => setIsLoading(false);

        handleStart();
        handleComplete();

        return () => {
            setIsLoading(false);
        };
    }, [location, setIsLoading]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (

        <Routes>
            <Route element={<UserProtectedRoute />}>
                <Route path="/" element={<Home />}>
                    <Route path="addQA" element={<AddQa2 />}></Route>
                    <Route path="chat" element={<Chat />}></Route>
                </Route>
            </Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="signup" element={<Signup />}></Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default function Routing() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            const id = window.localStorage.getItem("id");
            const token = window.localStorage.getItem("token");
            if (token) {
                try {
                    const response = await axios.post(`${apiUrl}/verify-token`, {
                        id, token,
                    });
                    if (response.data.success) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    setIsAuthenticated(false);
                    console.error("Error during token verification:", error);
                }
            }
            setIsLoading(false);
        };

        // checkAuth();
    }, []);

    return (
        <BrowserRouter>
            <RoutingContent
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </BrowserRouter>
    );
}
