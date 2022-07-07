import React, {useContext} from 'react';
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import styles from './TopNav.module.css';

function TopNav(props) {
    const history = useHistory();
    const {isAuth, user, logout} = useContext(AuthContext);

    return (
        <nav>
            <ul className={styles["nav__ul"]}>

                {isAuth === false &&
                    <>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/login" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-key"/> Inloggen
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/register" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-address-card"/> Registreren
                            </NavLink>
                        </li>
                    </>
                }

                {isAuth &&
                    <>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/search-books" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-magnifying-glass"/> Zoeken
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/my-books" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-book"/> Boeken
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/my-favorites" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-heart"/> Favorites
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/my-transactions" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-download"/> Transactions
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/my-profile" exact activeClassName={styles["active-link"]}>
                                <i className="fa-solid fa-user"/> Profiel
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={styles["nav-link"]} to="/" exact activeClassName={styles["active-link"]} onClick={logout}>
                                <i className="fa-solid fa-person-walking-arrow-right"/> Logout
                            </NavLink>
                        </li>
                    </>
                }
            </ul>
        </nav>
    );
}

export default TopNav;