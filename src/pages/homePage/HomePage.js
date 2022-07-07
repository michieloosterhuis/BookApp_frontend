import React, {useContext} from 'react';
import {AuthContext} from "../../context/AuthContext";
import PageHeader from "../../components/pageHeader/pageHeader";
import styles from './HomePage.module.css';

function HomePage(props) {
    const {isAuth, user} = useContext(AuthContext);

    return (
        <>
            <PageHeader
                pageTitle="Home"
            />
            <div>
                {isAuth
                    ?
                    <article className={styles["article"]}>
                        <h1>Welkom terug {user.username}!</h1>
                    </article>
                    :
                    <article className={styles["article"]}>
                        <h1>Welkom bij BookApp!</h1>
                        <p>Het platform voor het delen van 2e hands boeken. Klik op inloggen of registreer jezelf als nieuwe gebruiker.</p>
                    </article>
                }
            </div>

        </>
    );
}

export default HomePage;