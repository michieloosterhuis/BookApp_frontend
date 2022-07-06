import React, {useContext} from 'react';
import Book from "../book/Book";
import styles from './Transaction.module.css';
import icon_give from '../../assets/icon_give.svg';
import icon_receive from '../../assets/icon_recieve.svg';
import icon_give_red from '../../assets/icon_give_red.svg';
import icon_receive_green from '../../assets/icon_recieve_green.svg';

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
                    ? <img src={icon_give_red}/>
                    : <img src={icon_receive_green}/>
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
                        ? <img src={icon_give_red}/>
                        : <img src={icon_receive_green}/>
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