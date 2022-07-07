import React from 'react';
import styles from './pageHeader.module.css'

function PageHeader({pageTitle, children}) {
    return (
        <div className={styles["div"]}>
            <h1>{pageTitle}</h1>
            {children}
        </div>
    );
}

export default PageHeader;