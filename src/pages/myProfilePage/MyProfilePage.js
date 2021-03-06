import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import PageHeader from "../../components/pageHeader/pageHeader";
import Button from "../../components/button/Button";
import styles from "./MyProfilePage.module.css";

function MyProfilePage(props) {
    const {isAuth, user} = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const history = useHistory();

    const [userData, setUserData] = useState({});
    const {avatar, firstName, lastName, city, email} = userData;

    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function getMyProfile() {
            toggleError(false);
            toggleLoading(true);

            try {
                console.log(token)
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
                setStatusMessage("Er is iets misgegaan bij het opvragen van de data...");
            }

            toggleLoading(false);
        }

        getMyProfile();

        return function cleanup() {
            source.cancel();
        }

    }, []);

    return (
        <>
            <PageHeader
                pageTitle="Mijn profiel"
            />
            {loading && <p>Loading...</p>}
            {error === false &&
                <article className={styles["article"]}>
                    <image className={styles["article__image"]}>
                        {avatar
                            ? <img className={styles["article__img"]} src={avatar.url} alt="avatar"/>
                            : <i className="fa-solid fa-user fa-7x"/>
                        }
                    </image>
                    <div className={styles["article__div"]}>
                        <h3>{firstName} {lastName}</h3>
                        <p>{city}</p>
                        <a href={`mailto:${email}`}>{email}</a>
                    </div>
                    <Button
                        text="Edit"
                        icon="fa-solid fa-pen"
                        onClick={() => history.push(`/edit-my-profile`)}
                    />
                </article>
            }
        </>
    );
}

export default MyProfilePage;