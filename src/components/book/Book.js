import React from 'react';
import styles from './Book.module.css';
import {Link} from "react-router-dom";

function Book({
                  id,
                  bookCover,
                  title,
                  author,
                  year,
                  language,
                  transactionType,
                  owner: {username},
                  isAvailable,
                  children,
              }) {
    return (
        <article key={id} className={styles["book"]}>
            <div className={styles["book-heading"]}>
                <div>
                    {transactionType === "GIFT" && <span>Gratis afhalen</span>}
                    {transactionType === "EXCHANGE_FOR_BOOK" && <span>Ruilen voor een boek</span>}
                    {transactionType === "EXCHANGE_FOR_CAKE" && <span>Ruilen voor gebak</span>}
                    <span> | </span>
                    <span>{username}</span>
                </div>
                {isAvailable === "false" &&
                    <span className={styles["not-available"]}>In transactie</span>
                }
            </div>
            <div className={styles["container"]}>
                <div className={styles["book-cover"]}>
                    <img src={bookCover && bookCover.url} alt="book cover"/>
                </div>
                <div className={styles["book-info"]}>
                    <Link to={`/book-info/${id}`}><h3>{title}</h3></Link>
                    <p>{author}</p>
                    <span>{year}</span>
                    <span> | </span>
                    {language === "DUTCH" && <span>Nederlands</span>}
                    {language === "ENGLISH" && <span>Engels</span>}
                    {language === "GERMAN" && <span>Duits</span>}
                    {language === "FRENCH" && <span>Frans</span>}
                </div>
                <div className={styles["context-actions"]}>
                    {children}
                </div>
            </div>
        </article>
    );
};

export default Book;