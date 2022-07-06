import React from 'react';
import styles from './FilterAndSort.module.css';
import {useForm} from "react-hook-form";
import Button from "../button/Button";

function FilterAndSort({sort, setSort, languageFilter, setLanguageFilter, transactionTypeFilter, setTransactionTypeFilter}) {
    const {register, handleSubmit} = useForm({
        defaultValues: {
            sort: sort,
            languageFilter: languageFilter,
            transactionTypeFilter: transactionTypeFilter
        }
    });

    function applySortAndFilter(data) {
        const {sort, languageFilter, transactionTypeFilter} = data;
        console.log(data)

        setSort(sort);
        setLanguageFilter(languageFilter);
        setTransactionTypeFilter(transactionTypeFilter);
    }

    return (
        <form onSubmit={handleSubmit(applySortAndFilter)} className={styles["sort-filter"]}>
            <fieldset>
                <legend>Sorteren</legend>

                <label htmlFor="title">
                    <input
                        type="radio"
                        id="title"
                        value="title"
                        {...register("sort")}
                    />
                    Sorteren op titel
                </label>
                <label htmlFor="author">
                    <input
                        type="radio"
                        id="author"
                        value="author"
                        {...register("sort")}
                    />
                    Sorteren op schrijver
                </label>
            </fieldset>

            <fieldset>
                <legend>Taal</legend>

                <label htmlFor="language">
                    <input
                        type="checkbox"
                        id="language"
                        value="dutch"
                        {...register("languageFilter")}
                    />
                    Nederlands
                </label>

                <label htmlFor="language">
                    <input
                        type="checkbox"
                        id="language"
                        value="english"
                        {...register("languageFilter")}
                    />
                    Engels
                </label>

                <label htmlFor="language">
                    <input
                        type="checkbox"
                        id="language"
                        value="german"
                        {...register("languageFilter")}
                    />
                    Duits
                </label>

                <label htmlFor="language">
                    <input
                        type="checkbox"
                        id="language"
                        value="french"
                        {...register("languageFilter")}
                    />
                    Frans
                </label>

            </fieldset>

            <fieldset>
                <legend>Type transactie</legend>

                <label htmlFor="transaction-type">
                    <input
                        type="checkbox"
                        id="transaction-type"
                        value="gift"
                        {...register("transactionTypeFilter")}
                    />
                    Gratis afhalen
                </label>

                <label htmlFor="transaction-type">
                    <input
                        type="checkbox"
                        id="transaction-type"
                        value="exchange_for_book"
                        {...register("transactionTypeFilter")}
                    />
                    Ruilen voor een boek
                </label>

                <label htmlFor="transaction-type">
                    <input
                        type="checkbox"
                        id="transaction-type"
                        value="exchange_for_cake"
                        {...register("transactionTypeFilter")}
                    />
                    Ruilen voor gebak
                </label>

            </fieldset>
            <Button type="submit" text="Toepassen"/>
        </form>
    );
};

export default FilterAndSort;