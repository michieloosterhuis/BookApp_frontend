import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {useForm} from "react-hook-form";
import axios from "axios";
import Button from "../../components/button/Button";
import styles from './EditMyProfilePage.module.css';
import PageHeader from "../../components/pageHeader/pageHeader";

function EditMyProfilePage(props) {
    const {isAuth, user} = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const history = useHistory();

    const [userData, setUserData] = useState({});
    const [avatar, setAvatar] = useState();
    const [previewUrl, setPreviewUrl] = useState("");

    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const {register, formState: {errors}, handleSubmit, reset, formState} = useForm({
        mode: "onBlur"
    })

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function getMyProfile() {
            toggleError(false);
            toggleLoading(true);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/my-profile`,
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: token,
                            cancelToken: source.token,
                        }
                    });
                console.log("getMyProfile:", response);
                setUserData(response.data);
                setStatusMessage("Data opgehaald...");
            } catch (e) {
                console.error("getMyProfile:", e.response.data, e);
                toggleError(true);
                setStatusMessage("Er is iets misgegaan bij het opvragen van de data...")
            }

            toggleLoading(false);
        }

        getMyProfile();

        return function cleanup() {
            source.cancel();
        }

    }, []);

    useEffect(() => {
        reset(userData);
    }, [reset, userData]);

    function handleImageChange(e) {
        const uploadedFile = e.target.files[0];
        setAvatar(uploadedFile);
        setPreviewUrl(URL.createObjectURL(uploadedFile));
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

    async function updateProfile(data) {
        const {firstName, lastName, city, email} = data;

        try {
            const response = await axios.patch(
                `http://localhost:8080/api/v1/my-profile`,
                {
                    firstName: firstName,
                    lastName: lastName,
                    city: city,
                    email: email,
                },
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("updateProfile:", response);
            setStatusMessage("Profiel bewerkt...");
            await addAvatarToProfile();
            history.push("/my-profile")
        } catch (e) {
            console.error("updateProfile:", e.response.data, e);
            setStatusMessage("Profiel kan niet worden bewerkt...");
        }
    }

    return (
        <>
            <PageHeader
                pageTitle="Profiel bewerken"
                children={
                    <Button
                        text="Vorige"
                        icon="fa-solid fa-circle-arrow-left"
                        onClick={() => history.goBack()}
                    />
                }
            />
            <div>
                {loading && <p>Loading...</p>}
                {error === false &&
                    <form className={styles["form"]} onSubmit={handleSubmit(updateProfile)}>

                        <label className={styles["form__input--file"]} htmlFor="avatar">
                            {previewUrl
                                ?
                                <img className={styles["form__img"]} src={previewUrl} alt="avatar"/>
                                :
                                <>
                                    {userData.avatar
                                        ? <img className={styles["form__img"]} src={userData.avatar.url} alt="avatar"/>
                                        : <i className="fa-solid fa-user fa-7x"/>
                                    }
                                </>
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
                               {...register("firstName",
                                   {
                                       required: {
                                           value: true,
                                           message: "Verplicht veld."
                                       }
                                   })}
                        />
                        {errors.firstName && <p className={styles["form__p"]}>{errors.firstName.message}</p>}

                        <input className={styles["form__input"]}
                               type="text"
                               id="last-name"
                               {...register("lastName",
                                   {
                                       required: {
                                           value: true,
                                           message: "Verplicht veld."
                                       }
                                   })}
                        />
                        {errors.lastName && <p className={styles["form__p"]}>{errors.lastName.message}</p>}

                        <input className={styles["form__input"]}
                               type="text"
                               id="city"
                               {...register("city",
                                   {
                                       required: {
                                           value: true,
                                           message: "Verplicht veld."
                                       }
                                   })}
                        />
                        {errors.city && <p className={styles["form__p"]}>{errors.city.message}</p>}

                        <input className={styles["form__input"]}
                               type="email"
                               id="email"
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
                        {errors.city && <p className={styles["form__p"]}>{errors.city.message}</p>}

                        <Button
                            text="Opslaan"
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

export default EditMyProfilePage;