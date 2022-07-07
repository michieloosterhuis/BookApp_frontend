import React, {useContext} from 'react';
import Book from "../book/Book";
import styles from './Transaction.module.css';

import {AuthContext} from "../../context/AuthContext";
import Button from "../button/Button";

function Transaction({transactionData, role, children}) {
    const {isAuth, user} = useContext(AuthContext);

    const {
        id,
        transactionType,
        transactionStatusCode,
        date,
        requester,
        provider,
        requestedBook,
        exchangeBook
    } = transactionData;

    return (
        <article key={id} className={styles["transaction"]}>
            <div>
                <span>{date.split(" ")[0]}</span>
                <span> | </span>
                {transactionStatusCode === "INITIALIZED" && <span>Geïnitialiseerd</span>}
                {transactionStatusCode === "EXCHANGE_BOOK_SELECTED" && <span>Ruilboek geselecteerd</span>}
                {transactionStatusCode === "FINALIZED" && <span>Afgerond</span>}
            </div>

            <Book
                key={requestedBook.id}
                id={requestedBook.id}
                bookCover={requestedBook.bookCover}
                title={requestedBook.title}
                author={requestedBook.author}
                year={requestedBook.year}
                language={requestedBook.language}
                transactionType={requestedBook.transactionType}
                owner={requestedBook.owner}
                children={user.username === requestedBook.owner.username
                    ? <Button icon="fa-solid fa-download" backgroundColor="#649B92"/>
                    : <Button icon="fa-solid fa-upload" backgroundColor="#D62828"/>
                }
            />

            {exchangeBook !== null &&
                <Book
                    key={exchangeBook.id}
                    id={exchangeBook.id}
                    bookCover={exchangeBook.bookCover}
                    title={exchangeBook.title}
                    author={exchangeBook.author}
                    year={exchangeBook.year}
                    language={exchangeBook.language}
                    transactionType={exchangeBook.transactionType}
                    owner={exchangeBook.owner}
                    children={user.username === exchangeBook.owner.username
                        ? <Button icon="fa-solid fa-download" backgroundColor="#649B92"/>
                        : <Button icon="fa-solid fa-upload" backgroundColor="#D62828"/>
                    }
                />
            }
            <div className={styles["context-actions"]}>
                {children}
            </div>
        </article>
    );
}

export default Transaction;