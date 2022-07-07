import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import Book from "../../components/book/Book";
import {useHistory} from "react-router-dom";
import Button from "../../components/button/Button";
import PageHeader from "../../components/pageHeader/pageHeader";

function MyFavoritesPage(props) {
    const {user} = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const history = useHistory();

    const [favoriteData, setFavoriteData] = useState([]);
    const [favoriteId, setFavoriteId] = useState();

    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function getMyFavorites() {
            toggleError(false);
            toggleLoading(true);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/my-favorites`,
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: token,
                            cancelToken: source.token,
                        }
                    });
                console.log("getMyFavorites:", response);
                setFavoriteData(response.data);
                setStatusMessage("Data opgehaald...");
            } catch (e) {
                console.error("getMyFavorites:", e.response.data, e);
                toggleError(true);
                setStatusMessage("Er is iets misgegaan bij het opvragen van de data...");
            }


            toggleLoading(false);
        }

        getMyFavorites();

        return function cleanup() {
            source.cancel();
        }

    }, [favoriteId]);

    async function deleteMyFavorite(favoriteId) {
        toggleLoading(true);

        try {
            const response = await axios.delete(
                `http://localhost:8080/api/v1/my-favorites/${favoriteId}`,
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("deleteMyFavorite:", response);
            setFavoriteId(favoriteId);
            setStatusMessage("Favoriet verwijderd...");
        } catch (e) {
            console.error("deleteMyFavorite:", e.response.data, e);
            setStatusMessage("Favoriet kan niet worden verwijderd...");
        }

        toggleLoading(false);
    }

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
            setFavoriteId(bookId);
            setStatusMessage("Transactie toegevoegd...");
        } catch (e) {
            console.error("addTransaction:", e.response.data, e);
            setStatusMessage("Transactie kan niet worden toegevoegd...");
        }

        toggleLoading(false);
    }

    return (
        <>
            <PageHeader
                pageTitle="Mijn favorieten"
            />
            <div>
                {loading && <p>Loading...</p>}
                {error === false &&
                    <>
                        {favoriteData.length > 0 &&
                            favoriteData.map((favorite) => {
                                const {
                                    id,
                                    favoriteBook: {
                                        id: bookId,
                                        bookCover,
                                        title,
                                        author,
                                        year,
                                        language,
                                        transactionType,
                                        owner,
                                        isAvailable
                                    }
                                } = favorite;

                                return (
                                    <Book
                                        key={bookId}
                                        id={bookId}
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
                                                    icon="fa-solid fa-download"
                                                    onClick={() => addTransaction(bookId)}
                                                    disabled={isAvailable === "false" || owner.username === user.username}
                                                />
                                                <Button
                                                    icon="fa-solid fa-trash"
                                                    onClick={() => deleteMyFavorite(id)}
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

export default MyFavoritesPage;