import React, {useContext, useState} from 'react';
import {useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {useForm} from "react-hook-form";
import axios from "axios";
import Button from "../../components/button/Button";
import styles from './RegisterPage.module.css';
import PageHeader from "../../components/pageHeader/pageHeader";

function RegisterPage(props) {
    const {isAuth, user, login} = useContext(AuthContext);

    const history = useHistory();

    const [avatar, setAvatar] = useState();
    const [previewUrl, setPreviewUrl] = useState("");

    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const {register, formState: {errors}, handleSubmit, reset, formState} = useForm({
        mode: "onBlur"
    })

    function handleImageChange(e) {
        const uploadedFile = e.target.files[0];
        setAvatar(uploadedFile);
        setPreviewUrl(URL.createObjectURL(uploadedFile));
    }

    async function addUser(data) {
        const {firstName, lastName, city, email, username, password} = data;

        try {
            const response = await axios.post(
                `http://localhost:8080/api/v1/users`,
                {
                    firstName: firstName,
                    lastName: lastName,
                    city: city,
                    email: email,
                    username: username,
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": 'application/json',
                    }
                });
            console.log("addUser:", response);
            setStatusMessage("Gebruiker toegevoegd...");
            await makeLoginRequest(username, password);
            await addAvatarToProfile();
            history.push("/")
        } catch (e) {
            console.error("addUser:", e.response.data, e);
            setStatusMessage("Gebruiker kan niet worden toegevoegd...");
        }
    }

    async function makeLoginRequest(username, password) {

        try {
            const response = await axios.post("http://localhost:8080/api/v1/authentication",
                {
                    username: username,
                    password: password,
                })
            login(response.data.jwt);
        } catch (e) {
            console.error(e);
        }
    }

    async function addAvatarToProfile() {
        const formData = new FormData();
        formData.append("file", avatar);

        try {
            const response = await axios.patch(
                `http://localhost:8080/api/v1/my-profile/avatar`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: localStorage.getItem("token")
                    }
                });
            console.log("addAvatarToProfile:", response);
            setStatusMessage("Avatar toegevoegd...");
        } catch (e) {
            console.error("addAvatarToProfile:", e.response.data, e);
            setStatusMessage("Avatar kan niet worden toegevoegd...");
        }
    }

    return (
        <>
            <PageHeader
                pageTitle="Registreren"
            />
            <div>
                {error === false &&
                    <form className={styles["form"]} onSubmit={handleSubmit(addUser)}>

                        <label className={styles["form__input--file"]} htmlFor="avatar">
                            {previewUrl
                                ? <img className={styles["form__img"]} src={previewUrl} alt="avatar"/>
                                : <i className="fa-solid fa-user-plus fa-7x"></i>
                            }
                            <input
                                type="file"
                                id="avatar"
                                onChange={handleImageChange}
                            />
                        </label>

                        <input className={styles["form__input"]}
                               type="text"
                            id="first-name"
                            placeholder="Voornaam"
                            {...register("firstName",
                                {
                                    required: {
                                        value: true,
                                        message: "Verplicht veld."
                                    }
                                })}
                        />
                        {errors.firstName && <p>{errors.firstName.message}</p>}

                        <input className={styles["form__input"]}
                            type="text"
                            id="last-name"
                            placeholder="Achternaam"
                            {...register("lastName",
                                {
                                    required: {
                                        value: true,
                                        message: "Verplicht veld."
                                    }
                                })}
                        />
                        {errors.lastName && <p>{errors.lastName.message}</p>}

                        <input className={styles["form__input"]}
                            type="text"
                            id="city"
                            placeholder="Stad"
                            {...register("city",
                                {
                                    required: {
                                        value: true,
                                        message: "Verplicht veld."
                                    }
                                })}
                        />
                        {errors.city && <p>{errors.city.message}</p>}

                        <input className={styles["form__input"]}
                            type="email"
                            id="email"
                            placeholder="Email-adres"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Verplicht veld."
                                },
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Ongeldig email address"
                                }
                            })}
                        />
                        {errors.email && <p>{errors.email.message}</p>}

                        <input className={styles["form__input"]}
                            type="text"
                            id="username"
                            placeholder="Gebruikersnaam"
                            {...register("username",
                                {
                                    required: {
                                        value: true,
                                        message: "Verplicht veld."
                                    }
                                })}
                        />
                        {errors.username && <p>{errors.username.message}</p>}

                        <input className={styles["form__input"]}
                            type="password"
                            id="new-password"
                            placeholder="Wachtwoord"
                            {...register("password",
                                {
                                    required: {
                                        value: true,
                                        message: "Verplicht veld."
                                    },
                                    minLength: {
                                        value: 4,
                                        message: "Wachtwoord moet moet minimaal 4 tekens lang zijn."
                                    }
                                })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}

                        <Button
                            text="Registreren"
                            icon="fa-solid fa-circle-check"
                            type="submit"
                            disabled={!formState.isValid}
                        />
                    </form>
                }
            </div>
        </>
    );
}

export default RegisterPage;