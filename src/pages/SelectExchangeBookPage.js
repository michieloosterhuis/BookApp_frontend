import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from "../context/AuthContext";
import {Link, useHistory, useParams} from "react-router-dom";
import Book from "../components/book/Book";
import Button from "../components/button/Button";
import TitleHeader from "../components/titleHeader/TitleHeader";
import icon_back from "../assets/icon_back.svg";
import icon_receive from "../assets/icon_recieve.svg";

function SelectExchangeBookPage(props) {
    const {isAuth, user} = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const history = useHistory();

    const {transactionId, requesterUsername} = useParams();
    const [bookData, setBookData] = useState([]);

    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function getAvailableBooks() {
            toggleError(false);
            toggleLoading(true);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/available-books/${requesterUsername}`,
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: token,
                            cancelToken: source.token,
                        }
                    });
                console.log("getAvailableBooks:", response);
                setBookData(response.data);
                setStatusMessage("Data opgehaald...");
            } catch (e) {
                console.error("getAvailableBooks:", e.response.data, e);
                toggleError(true);
                setStatusMessage("Er is iets misgegaan bij het opvragen van de data...");
            }

            toggleLoading(false);
        }

        getAvailableBooks();

        return function cleanup() {
            source.cancel();
        }

    }, [requesterUsername]);

    async function addExchangeBookToTransaction(exchangeBookId) {
        toggleLoading(true);

        try {
            const response = await axios.patch(
                `http://localhost:8080/api/v1/my-transactions/${transactionId}/exchange-book`,
                {
                    exchangeBookId: exchangeBookId
                },
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("addExchangeBookToTransaction:", response);
            setStatusMessage("Ruilboek toegevoegd...");
            history.push("/my-transactions");
        } catch (e) {
            console.error("addExchangeBookToTransaction:", e.response.data, e);
            setStatusMessage("Ruilboek kan niet worden toegevoegd...");
        }

        toggleLoading(false);
    }

    return (
        <>
            <TitleHeader
                pageTitle="Select exchange book"
                children={
                    <Button onClick={() => history.goBack()} text="Back" icon={icon_back}/>
                }
            />
            <div>
                {loading && <p>Loading...</p>}
                {error === false &&
                    <>
                        {bookData.length > 0 &&
                            bookData.map((book) => {
                                const {id, bookCover, title, author, year, language, transactionType, owner, isAvailable} = book;
                                return (
                                    <Book
                                        key={id}
                                        id={id}
                                        bookCover={bookCover}
                                        title={title}
                                        author={author}
                                        year={year}
                                        language={language}
                                        transactionType={transactionType}
                                        owner={owner}
                                        isAvailable={isAvailable}
                                        children={
                                            <>
                                                <Button
                                                    text="Select"
                                                    icon={icon_receive}
                                                    onClick={() => addExchangeBookToTransaction(id)}
                                                />
                                            </>
                                        }
                                    />
                                )
                            })
                        }
                    </>
                }
            </div>
        </>
    );
}

export default SelectExchangeBookPage;