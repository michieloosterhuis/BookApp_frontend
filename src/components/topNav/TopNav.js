import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import styles from './TopNav.module.css';
import icon_my_book from "../../assets/icon_my_book.svg";
import icon_favorite from "../../assets/icon_favorite.svg";
import icon_transaction from "../../assets/icon_transaction.svg";
import icon_me from "../../assets/icon_me.svg";


function TopNav(props) {
    const {isAuth, user, logout} = useContext(AuthContext);

    return (
        <nav className={styles["nav"]}>
            <ul className={styles["nav__ul"]}>

                {isAuth === false &&
                    <>
                        <li>
                            <NavLink
                                to="/login"
                                className={styles["nav__li"]}
                                exact activeClassName={styles["nav__li--active"]}
                            >
                                Login
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/register"
                                className={styles["nav__li"]}
                                exact activeClassName={styles["nav__li--active"]}
                            >
                                Register
                            </NavLink>
                        </li>
                    </>
                }

                {isAuth &&
                    <>
                        <li>
                            <NavLink
                                to="/search-books"
                                className={styles["nav__li"]}
                                exact activeClassName={styles["nav__li--active"]}
                            >
                                Search
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/my-books"
                                className={styles["nav__li"]}
                                exact activeClassName={styles["nav__li--active"]}
                            >
                                My books
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/my-favorites"
                                className={styles["nav__li"]}
                                exact activeClassName={styles["nav__li--active"]}
                            >
                                My favorites
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/my-transactions"
                                className={styles["nav__li"]}
                                exact activeClassName={styles["nav__li--active"]}
                            >
                                My transactions
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/my-profile"
                                className={styles["nav__li"]}
                                exact activeClassName={styles["active-link"]}
                            >
                                {user.username}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/"
                                className={styles["nav__li"]}
                                exact activeClassName={styles["nav__li--active"]}
                                onClick={logout}
                            >
                                Uitloggen
                            </NavLink>
                        </li>
                    </>
                }
            </ul>
        </nav>
    );
}

export default TopNav;