import React from 'react';
import styles from './Button.module.css';
import {Link, useHistory} from "react-router-dom";

function Button({onClick, text, type, disabled, icon, highlight}) {
    const history = useHistory();

    return (
        <button
            className={disabled
                ? styles["button--disabled"]
                : styles["button"]
            }
            type={type}
            onClick={onClick}
            disabled={disabled}>{icon && <img
            src={icon}/>}{text && text}
        </button>
    );
}

export default Button;