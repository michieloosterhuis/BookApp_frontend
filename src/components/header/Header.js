import React from 'react';
import TopNav from "../topNav/TopNav";
import icon_book from "../../assets/icon_book.svg";
import styles from './Header.module.css';
import {useHistory} from "react-router-dom";

function Header() {
    const history = useHistory();

    return (
        <header className={styles["header"]}>
            <div className={styles["header__div"]}>
                <span className={styles["header__span"]} onClick={() => history.push("/")}>
                    <img className={styles["header__img"]} src={icon_book} alt="book-icon"/>
                    <h2 className={styles["header__h2"]}>BookApp</h2>
                </span>
                <TopNav/>
            </div>
        </header>
    );
};

export default Header;