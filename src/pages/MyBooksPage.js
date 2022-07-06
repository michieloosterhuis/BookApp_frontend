import React, {useEffect, useState} from 'react';
import axios from "axios";
import Book from "../components/book/Book";
import {useHistory} from "react-router-dom";
import Button from "../components/button/Button";
import icon_trash from "../assets/icon_trash.svg";
import icon_edit from "../assets/icon_edit.svg";
import TitleHeader from "../components/titleHeader/TitleHeader";
import icon_add from "../assets/icon_add.svg";

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
            <TitleHeader
                pageTitle="My books"
                children={
                    <Button onClick={() => history.push("/add-book")} text="Add book" icon={icon_add}/>
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
                                                    onClick={() => history.push(`/edit-my-book/${id}`)}
                                                    disabled={isAvailable === "false"}
                                                    icon={icon_edit}
                                                />
                                                <Button
                                                    onClick={() => deleteMyBook(id)}
                                                    disabled={isAvailable === "false"}
                                                    icon={icon_trash}/>
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