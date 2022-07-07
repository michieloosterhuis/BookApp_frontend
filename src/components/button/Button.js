import React from 'react';
import styles from './Button.module.css'

function Button({onClick, text, type, disabled, icon, backgroundColor}) {

    return (
        <>
            {disabled ?
                <button
                    className={styles["button--disabled"]}
                    type={type}
                    disabled={disabled}
                >
                    <i className={icon + " fa-lg"}/>
                    {text && " " + text}
                </button>
                :
                <button
                    className={styles["button"]}
                    style={{backgroundColor: backgroundColor}}
                    type={type}
                    onClick={onClick}
                >
                    <i className={icon + " fa-lg"}/>
                    {text && " " + text}
                </button>
            }
        </>

    );
}

export default Button;