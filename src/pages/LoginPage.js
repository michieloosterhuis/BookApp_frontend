import React, {useContext} from 'react';
import {AuthContext} from "../context/AuthContext";
import {useForm} from "react-hook-form";
import axios from "axios";
import styles from './LoginPage.module.css';
import TitleHeader from "../components/titleHeader/TitleHeader";
import Button from "../components/button/Button";
import icon_accept from "../assets/icon_accept.svg";
import icon_me from "../assets/icon_me.svg";

function LoginPage(props) {
    const {login} = useContext(AuthContext)
    const {register, handleSubmit} = useForm()

    async function makeLoginRequest(data) {
        const {username, password} = data;

        try {
            const response = await axios.post("http://localhost:8080/api/v1/authentication",
                {
                    username: username,
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }
            )
            login(response.data.jwt);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <TitleHeader
                pageTitle="Login"
            />
            <form className={styles["form"]} onSubmit={handleSubmit(makeLoginRequest)}>
                <img className={styles["form__img"]} src={icon_me} alt="avatar"/>
                <input className={styles["form__input"]}
                    type="text"
                    id="username"
                    placeholder="Gebruikersnaam"
                    {...register("username")}
                />
                <input className={styles["form__input"]}
                    type="password"
                    id="password"
                    placeholder="Wachtwoord"
                    {...register("password")}
                />
                <Button
                    text="Inloggen"
                    icon={icon_accept}
                    type="submit"
                />
            </form>
        </>
    );
}

export default LoginPage;