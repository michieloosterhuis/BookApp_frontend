import React, {useContext, useState} from 'react';
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import styles from './TopNav.module.css';

function TopNav(props) {
    const history = useHistory();
    const {isAuth, user, logout} = useContext(AuthContext);
    const {windowWidth, setWindowWidth} = useState();

    window.onresize = function (event) {
        console.log(window.innerWidth)
        setWindowWidth(window.innerWidth);
    }
    console.log(windowWidth);

    return (
        <nav className={styles["nav"]}>
            <ul className={styles["nav__ul"]}>

                {isAuth === false &&
                    <>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/login" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-key"/><span> Inloggen</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/register" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-address-card"/><span> Registreren</span>
                            </NavLink>
                        </li>
                    </>
                }

                {isAuth &&
                    <>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/search-books" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-magnifying-glass"/><span> Zoeken</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/my-books" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-book"/><span> Boeken</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/my-favorites" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-heart"/><span> Favorieten</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/my-transactions" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-download"/><span> Transacties</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/my-profile" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-user"/><span> Profiel</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/" exact activeClassName={styles["active-link"]} onClick={logout}>
                                <i className="fa-solid fa-person-walking-arrow-right"/><span> Uitloggen</span>
                            </NavLink>
                        </li>
                    </>
                }
            </ul>
        </nav>
    );
}

export default TopNav;