import React from 'react';
import styles from './PageWrapper.module.css';

function PageWrapper({ children }) {
    return (
        <main className={styles["outer-container"]}>
            <section className={styles["inner-container"]}>
                {children}
            </section>
        </main>
    );
}

export default PageWrapper;