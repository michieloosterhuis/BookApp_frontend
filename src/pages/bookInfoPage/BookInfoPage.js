import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import Button from "../../components/button/Button";
import styles from './BookInfoPage.module.css';
import PageHeader from "../../components/pageHeader/pageHeader";

function BookInfoPage(props) {
    const {isAuth, user} = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const history = useHistory();

    const {bookId} = useParams();
    const [bookData, setBookData] = useState({});
    const {bookCover, title, author, year, language, transactionType, owner, isAvailable} = bookData;

    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {

        async function getBook() {
            toggleError(false);
            toggleLoading(true);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/books/${bookId}`,
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: token,
                        }
                    });
                setBookData(response.data);
            } catch (e) {
                console.error(e);
                toggleError(true);
            }

            toggleLoading(false);
        }

        getBook();

    }, [bookId]);

    async function addTransaction(bookId) {
        toggleLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:8080/api/v1/my-transactions`,
                {
                    requesterUsername: user.username,
                    requestedBookId: bookId,
                },
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("addTransaction:", response);
            setStatusMessage("Transactie toegevoegd...");
        } catch (e) {
            console.error("addTransaction:", e.response.data, e);
            setStatusMessage("Transactie kan niet worden toegevoegd...");
        }

        toggleLoading(false);
    }

    async function addToFavorites(bookId) {
        toggleLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:8080/api/v1/favorites`,
                {
                    username: user.username,
                    favoriteBookId: bookId,
                },
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("addFavorite:", response);
            setStatusMessage("Favoriet toegevoegd...");
        } catch (e) {
            console.error("addFavorite:", e.response.data, e);
            setStatusMessage("Favoriet kan niet worden toegevoegd...");
        }

        toggleLoading(false);
    }

    return (
        <>
            <PageHeader
                pageTitle="Book info"
                children={
                    <Button
                        text="Back"
                        icon="fa-solid fa-circle-arrow-left"
                        onClick={() => history.goBack()}
                    />
                }
            />
            <article className={styles["article"]}>
                <div className={styles["book-cover"]}>
                    <img src={bookCover && bookCover.url} alt="book cover"/>
                </div>
                <h3>{title}</h3>
                <p>{author}</p>
                <div>
                    <span>{year}</span>
                    <span> | </span>
                    {language === "DUTCH" && <span>Nederlands</span>}
                    {language === "ENGLISH" && <span>Engels</span>}
                    {language === "GERMAN" && <span>Duits</span>}
                    {language === "FRENCH" && <span>Frans</span>}
                </div>
                <div>
                    {owner && <>
                        <span>{owner.username}</span>
                        <span> | </span>
                    </>}
                    {transactionType === "GIFT" && <span>Gratis afhalen</span>}
                    {transactionType === "EXCHANGE_FOR_BOOK" && <span>Ruilen voor een boek</span>}
                    {transactionType === "EXCHANGE_FOR_CAKE" && <span>Ruilen voor gebak</span>}
                </div>
                <div>
                    {isAvailable === "false" &&
                        <>
                            <span className={styles["not-available"]}>Niet beschikbaar</span>
                        </>
                    }
                </div>
                <div>
                    <Button
                        icon="fa-solid fa-heart"
                        onClick={() => addToFavorites(bookId)}
                        disabled={bookData.owner && bookData.owner.username === user.username}
                    />
                    <Button
                        icon="fa-solid fa-download"
                        onClick={() => addTransaction(bookId)}
                        disabled={bookData.owner && (bookData.isAvailable === "false" || owner.username === user.username)}
                    />
                </div>
            </article>
        </>
    )
        ;
}

export default BookInfoPage;