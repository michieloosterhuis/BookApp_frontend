import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import Button from "../../components/button/Button";
import PageHeader from "../../components/pageHeader/pageHeader";
import styles from "../myProfilePage/MyProfilePage.module.css";

function UserInfoPage(props) {
    const {isAuth, user} = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const history = useHistory();

    const {username} = useParams();
    const [userData, setUserData] = useState({});
    const {avatar, firstName, lastName, city, email} = userData;

    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function getUserInfo() {
            toggleError(false);
            toggleLoading(true);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/users/${username}`,
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: token,
                        }
                    });
                console.log("getUserInfo:", response);
                setUserData(response.data);
                setStatusMessage("Data opgehaald...");
            } catch (e) {
                console.error("getUserInfo:", e.response.data, e);
                toggleError(true);
                setStatusMessage("Er is iets misgegaan bij het opvragen van de data...");
            }

            toggleLoading(false);
        }

        getUserInfo();

    }, [token, username]);

    return (
        <>
            <PageHeader
                pageTitle="Profiel gebruiker"
                children={
                    <Button
                        text="Back"
                        icon="fa-solid fa-circle-arrow-left"
                        onClick={() => history.goBack()}
                    />
                }
            />
            {loading && <p>Loading...</p>}
            {error === false &&
                <article className={styles["article"]}>
                    {avatar &&
                        <image className={styles["article__image"]}>
                            <img className={styles["article__img"]} src={avatar.url} alt="avatar"/>
                        </image>
                    }
                    <div className={styles["article__div"]}>
                        <h3>{firstName} {lastName}</h3>
                        <p>{city}</p>
                        <a href={`mailto:${email}`}>{email}</a>
                    </div>
                </article>
            }
        </>
    );
}

export default UserInfoPage;