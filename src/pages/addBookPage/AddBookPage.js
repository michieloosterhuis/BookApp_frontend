import React, {useContext, useState} from 'react';
import {useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {useForm} from "react-hook-form";
import axios from "axios";
import Button from "../../components/button/Button";
import PageHeader from "../../components/pageHeader/pageHeader";
import styles from "../registerPage/RegisterPage.module.css";

function AddBookPage(props) {
    const {isAuth, user} = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const history = useHistory();

    const [bookCover, setBookCover] = useState();
    const [previewUrl, setPreviewUrl] = useState("");

    const [loading, toggleLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const {register, formState: {errors}, handleSubmit, formState} = useForm({
        mode: "onBlur"
    })

    function handleImageChange(e) {
        const uploadedFile = e.target.files[0];
        setBookCover(uploadedFile);
        setPreviewUrl(URL.createObjectURL(uploadedFile));
    }

    async function addBook(data) {
        toggleLoading(true);
        const {title, author, year, language, transactionType} = data;
        let bookId;

        try {
            const response = await axios.post(
                `http://localhost:8080/api/v1/my-books`,
                {
                    title: title,
                    author: author,
                    year: year,
                    language: language,
                    transactionType: transactionType,
                    ownerUsername: user.username,
                },
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("addBook:", response);
            bookId = response.data.id;
            setStatusMessage("Boek toegevoegd...");
            await addBookCoverToBook(bookId);
            history.push("/my-books")
        } catch (e) {
            console.error("addBook:", e.response.data, e);
            setStatusMessage("Boek kan niet worden toegevoegd...");
        }
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

    return (
        <>
            <PageHeader
                pageTitle="Boek toevoegen"
                children={
                    <Button
                        text="Vorige"
                        icon="fa-solid fa-circle-arrow-left fa"
                        onClick={() => history.goBack()}
                    />
                }
            />
            <div>
                <form className={styles["form"]} onSubmit={handleSubmit(addBook)}>

                    <label className={styles["form__input--file"]} htmlFor="book-cover">
                        {previewUrl
                            ? <img className={styles["form__img"]} src={previewUrl} alt="book-cover"/>
                            : <i className="fa-solid fa-book fa-7x"></i>
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
                        text="Toevoegen"
                        icon="fa-solid fa-circle-plus"
                        type="submit"
                        disabled={!formState.isValid}
                    />
                </form>
            </div>
        </>

    );
}

export default AddBookPage;