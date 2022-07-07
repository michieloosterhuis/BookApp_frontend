import React, {useContext} from 'react';
import {AuthContext} from "../../context/AuthContext";
import {useForm} from "react-hook-form";
import axios from "axios";
import styles from './LoginPage.module.css';
import PageHeader from "../../components/pageHeader/pageHeader";
import Button from "../../components/button/Button";

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
            <PageHeader
                pageTitle="Inloggen"
            />
            <form className={styles["form"]} onSubmit={handleSubmit(makeLoginRequest)}>
                <i className="fa-solid fa-user fa-7x"></i>
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
                    icon="fa-solid fa-circle-check"
                    type="submit"
                />
            </form>
        </>
    );
}

export default LoginPage;