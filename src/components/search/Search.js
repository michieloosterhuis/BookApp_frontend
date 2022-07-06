import React from 'react';
import styles from './Search.module.css';
import {useForm} from "react-hook-form";
import Button from "../button/Button";
import icon_search from "../../assets/icon_search.svg";

function Search({searchText, setSearchText}) {

    function applySearch(event) {
        event.preventDefault();
        console.log(event.target.value)
        setSearchText(event.target.value);
    }

    return (
        <form className={styles["form"]}>
            <label className={styles["form__label"]} htmlFor="search">
                <input className={styles["form__input"]}
                    type="text"
                    id="search"
                    placeholder="Zoek op schrijver of titel..."
                    onChange={applySearch}
                />
                <Button
                    text="Zoek"
                    icon={icon_search}
                    onClick={applySearch}
                />
            </label>

        </form>
    );
}

export default Search;