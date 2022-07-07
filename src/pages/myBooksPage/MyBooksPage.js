import React, {useEffect, useState} from 'react';
import axios from "axios";
import Book from "../../components/book/Book";
import {useHistory} from "react-router-dom";
import Button from "../../components/button/Button";
import PageHeader from "../../components/pageHeader/pageHeader";

function MyBooksPage(props) {
    const token = localStorage.getItem("token");

    const history = useHistory();

    const [bookData, setBookData] = useState([]);
    const [bookId, setBookId] = useState();

    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function getMyBooks() {
            toggleError(false);
            toggleLoading(true);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/my-books`,
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: token,
                            cancelToken: source.token,
                        }
                    });
                console.log("getMyBooks:", response);
                setBookData(response.data);
                setStatusMessage("Data opgehaald...");
            } catch (e) {
                console.error("getMyBooks:", e.response.data, e);
                toggleError(true);
                setStatusMessage("Er is iets misgegaan bij het opvragen van de data...");
            }


            toggleLoading(false);
        }

        getMyBooks();

        return function cleanup() {
            source.cancel();
        }

    }, [bookId]);

    async function deleteMyBook(bookId) {
        toggleLoading(true);

        try {
            const response = await axios.delete(
                `http://localhost:8080/api/v1/my-books/${bookId}`,
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("deleteMyBook:", response);
            setBookId(bookId);
            setStatusMessage("Boek verwijderd...");
        } catch (e) {
            console.error("deleteMyBook:", e.response.data, e);
            setStatusMessage("Boek kan niet worden verwijderd...");
        }

        toggleLoading(false);
    }

    return (
        <>
            <PageHeader
                pageTitle="Mijn boeken"
                children={
                    <Button
                        text="Boek toevoegen"
                        icon="fa-solid fa-circle-plus"
                        onClick={() => history.push("/add-book")}
                    />
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
                                                    icon="fa-solid fa-pen"
                                                    onClick={() => history.push(`/edit-my-book/${id}`)}
                                                    disabled={isAvailable === "false"}
                                                />
                                                <Button
                                                    icon="fa-solid fa-trash-can"
                                                    onClick={() => deleteMyBook(id)}
                                                    disabled={isAvailable === "false"}
                                                    backgroundColor="#D62828"
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

export default MyBooksPage;