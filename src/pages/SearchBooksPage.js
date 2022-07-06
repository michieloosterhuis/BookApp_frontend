import React, {useContext, useEffect, useState} from 'react';
import Button from "../components/button/Button";
import FilterAndSort from "../components/filterAndSort/FilterAndSort";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import Book from "../components/book/Book";
import Search from "../components/search/Search";
import TitleHeader from "../components/titleHeader/TitleHeader";
import icon_favorite from "../assets/icon_favorite.svg";
import icon_receive from "../assets/icon_recieve.svg";
import icon_filter from "../assets/icon_filter.svg";

function SearchBooksPage(props) {
    const {isAuth, user} = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const history = useHistory();

    const [showFilters, toggleShowFilters] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [sortType, setSortType] = useState("title");
    const [languageFilter, setLanguageFilter] = useState(["dutch", "english", "german", "french"]);
    const [transactionTypeFilter, setTransactionTypeFilter] = useState(["gift", "exchange_for_book", "exchange_for_cake"]);

    const [bookData, setBookData] = useState([]);
    const [bookId, setBookId] = useState();

    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function searchBooks() {
            toggleError(false);
            toggleLoading(true);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/books`,
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: token,
                            cancelToken: source.token,
                        },
                        params: {
                            search: searchText,
                            sort: sortType,
                            languages: languageFilter.toString(),
                            transactionTypes: transactionTypeFilter.toString(),
                        }
                    });
                console.log("searchBooks:", response);
                setBookData(response.data);
                setStatusMessage("Data opgehaald...");
            } catch (e) {
                console.error("searchBooks:", e.response.data, e);
                toggleError(true);
                setStatusMessage("Er is iets misgegaan bij het opvragen van de data...");
            }

            toggleLoading(false);
        }

        searchBooks();

        return function cleanup() {
            source.cancel();
        }

    }, [searchText, sortType, languageFilter, transactionTypeFilter, bookId, token]);

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
            setBookId(bookId);
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
            setBookId(bookId);
            setStatusMessage("Favoriet toegevoegd...");
        } catch (e) {
            console.error("addFavorite:", e.response.data, e);
            setStatusMessage("Favoriet kan niet worden toegevoegd...");
        }

        toggleLoading(false);
    }

    return (
        <>
            <TitleHeader
                pageTitle="Search books"
            />
            <div>
                <Search searchText={searchText} setSearchText={setSearchText}/>
            </div>
            <div>
                <Button
                    text="Filteren & Sorteren"
                    icon={icon_filter}
                    onClick={() => toggleShowFilters(!showFilters)}
                />
                {showFilters &&
                    <FilterAndSort
                        sort={sortType}
                        setSort={setSortType}
                        languageFilter={languageFilter}
                        setLanguageFilter={setLanguageFilter}
                        transactionTypeFilter={transactionTypeFilter}
                        setTransactionTypeFilter={setTransactionTypeFilter}
                    />
                }
            </div>
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
                                                    onClick={() => addToFavorites(id)}
                                                    icon={icon_favorite}
                                                    disabled={owner.username === user.username}
                                                />
                                                <Button
                                                    onClick={() => addTransaction(id)}
                                                    icon={icon_receive}
                                                    disabled={isAvailable === "false" || owner.username === user.username}
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

export default SearchBooksPage;