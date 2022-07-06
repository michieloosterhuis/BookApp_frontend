import React, {useContext} from 'react';
import {AuthContext} from "../context/AuthContext";
import TitleHeader from "../components/titleHeader/TitleHeader";
import styles from './HomePage.module.css';

function HomePage(props) {
    const {isAuth, user} = useContext(AuthContext);

    return (
        <>
            <TitleHeader
                pageTitle="Homepage"
            />
            <div>
                {isAuth &&
                    <>
                        {isAuth
                            ?
                            <article>
                                <h1>Welkom terug bij BookApp {user.username}!</h1>
                            </article>
                            :
                            <article>
                                <h1>Welkom bij BookApp</h1>
                                <p>Het platform voor het delen van 2e hands boeken.</p>
                                <p>Login of registreer jezelf als nieuwe gebruiker.</p>}
                            </article>
                        }
                    </>
                }
            </div>

        </>
    );
}

export default HomePage;