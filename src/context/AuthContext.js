import React, {createContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext({});

function AuthContextProvider({children}) {
    const history = useHistory();
    const [auth, setAuth] = useState({
        isAuth: false,
        user: null,
        status: "pending",
        login: login,
        logout: logout,
    });
    console.log(auth)

    useEffect(() => {
        const token = localStorage.getItem("token");
        //TODO: check validity of token...

        if (token) {
            async function getMyProfile() {
                try {
                    const response = await axios.get("http://localhost:8080/api/v1/my-profile",
                        {
                            headers: {
                                "Content-Type": 'application/json',
                                Authorization: token,
                            }
                        });
                    console.log("getMyProfile", response);
                    setAuth({
                        ...auth,
                        isAuth: true,
                        user: {
                            username: response.data.username,
                            email: response.data.email
                        },
                        status: "done"
                    })
                } catch (e) {
                    console.error("getMyProfile", e.response.data);
                }
            }

            getMyProfile();
        } else {
            setAuth({
                ...auth,
                isAuth: false,
                user: null,
                status: "done"
            });
        }
    }, []);

    function login(token) {
        localStorage.setItem("token", `Bearer ${token}`);
        console.log(localStorage.getItem("token"));

        async function getMyProfile() {
            try {
                const response = await axios.get("http://localhost:8080/api/v1/my-profile",
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: `Bearer ${token}`,
                        }
                    });
                console.log("getMyProfile", response);
                setAuth({
                    ...auth,
                    isAuth: true,
                    user: {
                        username: response.data.username,
                        email: response.data.email
                    },
                    status: "done"
                })
                history.push("/")
            } catch (e) {
                console.error("getMyProfile", e.response.data);
                setAuth({
                    ...auth,
                    isAuth: false,
                    user: null,
                    status: "done"
                })

            }
        }

        getMyProfile();
    }

    function logout() {
        console.log("logout")
        localStorage.removeItem("token");
        setAuth({
            ...auth,
            isAuth: false,
            user: null,
            status: "done",
        });
        history.push("/");
    }

    const data = {
        ...auth
    }

    return (
        <AuthContext.Provider value={data}>
            {auth.status === 'pending'
                ? <p>Loading...</p>
                : children
            }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;