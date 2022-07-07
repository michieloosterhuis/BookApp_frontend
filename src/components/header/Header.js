import React from 'react';
import TopNav from "../topNav/TopNav";
import styles from './Header.module.css';
import {useHistory} from "react-router-dom";

function Header() {
    const history = useHistory();

    return (
        <header className={styles["header"]}>
            <div className={styles["header__div"]}>
                <span className={styles["header__span"]} onClick={() => history.push("/")}>
                    <i className="fa-solid fa-book-open"/>
                    <h2>BookApp</h2>
                </span>
                <TopNav/>
            </div>
        </header>
    );
};

export default Header;