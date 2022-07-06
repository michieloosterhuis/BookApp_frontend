import React from 'react';
import styles from './TitleHeader.module.css'

function TitleHeader({pageTitle, children}) {
    return (
        <div className={styles["div"]}>
            <h1>{pageTitle}</h1>
            {children}
        </div>
    );
}

export default TitleHeader;