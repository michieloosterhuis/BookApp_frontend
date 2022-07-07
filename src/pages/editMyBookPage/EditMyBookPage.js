import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import Button from "../../components/button/Button";
import PageHeader from "../../components/pageHeader/pageHeader";
import styles from "./EditMyBookPage.module.css";

function EditMyBookPage(props) {
    const token = localStorage.getItem("token");

    const history = useHistory();

    const {bookId} = useParams();
    const [bookData, setBookData] = useState({});
    const [bookCover, setBookCover] = useState();
    const [previewUrl, setPreviewUrl] = useState("");

    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const {register, formState: {errors}, handleSubmit, reset, formState} = useForm({
        mode: "onBlur"
    })

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function getMyBook() {
            toggleError(false);
            toggleLoading(true);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/books/${bookId}`,
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: token,
                            cancelToken: source.token,
                        }
                    });
                console.log("getMyBook:", response);
                setBookData(response.data);
                setStatusMessage("Data opgehaald...");
            } catch (e) {
                console.error("getMyBook:", e.response.data, e);
                toggleError(true);
                setStatusMessage("Er is iets misgegaan bij het opvragen van de data...")
            }

            toggleLoading(false);
        }

        getMyBook();

        return function cleanup() {
            source.cancel();
        }

    }, [bookId]);

    useEffect(() => {
        reset(bookData);
    }, [bookData]);

    function handleImageChange(e) {
        const uploadedFile = e.target.files[0];
        setBookCover(uploadedFile);
        setPreviewUrl(URL.createObjectURL(uploadedFile));
    }

    async function addBookCoverToBook(bookId) {
        const formData = new FormData();
        formData.append("file", bookCover);

        try {
            const response = await axios.patch(
                `http://localhost:8080/api/v1/my-books/${bookId}/book-cover`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: localStorage.getItem("token")
                    }
                });
            console.log("addBookCoverToBook:", response);
            setStatusMessage("Boekomslag toegevoegd...");
        } catch (e) {
            console.error("addBookCoverToBook:", e.response.data, e);
            setStatusMessage("Boekomslag kan niet worden toegevoegd...");
        }
    }

    async function updateBook(data) {
        toggleLoading(true);
        const {title, author, year, language, transactionType} = data;

        try {
            const response = await axios.patch(
                `http://localhost:8080/api/v1/my-books/${bookId}`,
                {
                    title: title,
                    author: author,
                    year: year,
                    language: language,
                    transactionType: transactionType,
                },
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("updateBook:", response);
            setStatusMessage("Boek bewerkt...");
            await addBookCoverToBook(bookId);
            history.push("/my-books")
        } catch (e) {
            console.error("updateBook:", e.response.data, e);
            setStatusMessage("Boek kan niet worden bewerkt...");
        }
    }

    return (
        <>
            <PageHeader
                pageTitle="Boek bewerken"
                children={
                    <Button
                        text="Vorige"
                        icon="fa-solid fa-circle-arrow-left"
                        onClick={() => history.goBack()} />
                }
            />
            <div>
                {loading && <p>Loading...</p>}
                {error === false &&
                    <form className={styles["form"]} onSubmit={handleSubmit(updateBook)}>

                        <label className={styles["form__input--file"]} htmlFor="book-cover">
                            {previewUrl
                                ? <img className={styles["form__img"]} src={previewUrl} alt="book-cover"/>
                                : <>{bookData.bookCover
                                    ? <img className={styles["form__img"]} src={bookData.bookCover.url} alt="book-cover"/>
                                    : <i className="fa-solid fa-book fa-7x"></i>
                            }</>
                            }
                            <input
                                type="file"
                                id="book-cover"
                                onChange={handleImageChange}
                            />
                        </label>

                        <input className={styles["form__input"]}
                               type="text"
                               id="title"
                               placeholder="Titel"
                               {...register("title",
                                   {
                                       required: {
                                           value: true,
                                           message: "Verplicht veld."
                                       }
                                   })}
                        />
                        {errors.title && <p className={styles["form__p"]}>{errors.title.message}</p>}

                        <input className={styles["form__input"]}
                               type="text"
                               id="author"
                               placeholder="Schrijver"
                               {...register("author",
                                   {
                                       required: {
                                           value: true,
                                           message: "Verplicht veld."
                                       }
                                   })}
                        />
                        {errors.author && <p className={styles["form__p"]}>{errors.author.message}</p>}

                        <input className={styles["form__input"]}
                               type="number"
                               id="year"
                               placeholder="Jaartal"
                               {...register("year",
                                   {
                                       required: {
                                           value: true,
                                           message: "Verplicht veld."
                                       },
                                       min: {
                                           value: 1450,
                                           message: "De boekdrukkunst was toen nog niet uitgevonden..."
                                       },
                                       max: {
                                           value: new Date().getFullYear(),
                                           message: "Dit jaartal ligt in de toekomst..."
                                       },
                                   })}
                        />
                        {errors.year && <p className={styles["form__p"]}>{errors.year.message}</p>}

                        <select className={styles["form__select"]}
                                id="language"
                                {...register("language")}
                        >
                            <option value="DUTCH">Nederlands</option>
                            <option value="ENGLISH">Engels</option>
                            <option value="GERMAN">Duits</option>
                            <option value="FRENCH">Frans</option>
                        </select>

                        <select className={styles["form__select"]}
                                id="transaction-type"
                                {...register("transactionType")}
                        >
                            <option value="GIFT">Gratis af te halen</option>
                            <option value="EXCHANGE_FOR_BOOK">Ruilen voor een boek</option>
                            <option value="EXCHANGE_FOR_CAKE">Ruilen voor gebak</option>
                        </select>

                        <Button
                            text="Update"
                            icon="fa-solid fa-circle-check"
                            type="submit"
                            disabled={!formState.isValid} />
                    </form>
                }
            </div>
        </>
    );
}

export default EditMyBookPage;