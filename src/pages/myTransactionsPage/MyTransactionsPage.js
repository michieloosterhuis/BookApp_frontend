import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import Transaction from "../../components/transaction/Transaction";
import {useHistory} from "react-router-dom";
import Button from "../../components/button/Button";
import PageHeader from "../../components/pageHeader/pageHeader";

function MyTransactionsPage(props) {
    const {isAuth, user} = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const history = useHistory();

    const [transactionData, setTransactionData] = useState([]);
    const [transactionId, setTransactionId] = useState();
    const [exchangeBookId, setExchangeBookId] = useState();

    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function getMyTransactions() {
            toggleError(false);
            toggleLoading(true);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/my-transactions`,
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: token,
                            cancelToken: source.token,
                        }
                    });
                console.log("getMyTransactions:", response);
                setTransactionData(response.data);
                setStatusMessage("Data opgehaald...")
            } catch (e) {
                console.error("getMyTransactions:", e.response.data, e);
                toggleError(true);
                setStatusMessage("Er is iets misgegaan bij het opvragen van de data...")
            }

            toggleLoading(false);
        }

        getMyTransactions();

        return function cleanup() {
            source.cancel();
        }

    }, [transactionId]);

    async function approveTransaction(transactionId) {
        toggleLoading(true);

        try {
            const response = await axios.patch(
                `http://localhost:8080/api/v1/my-transactions/${transactionId}/approve`,
                {},
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("approveTransaction:", response);
            setTransactionId(transactionId);
            setStatusMessage("Transactie goedgekeurd...");
        } catch (e) {
            console.error("approveTransaction:", e.response.data, e);
            setStatusMessage("Transactie kan niet worden goedgekeurd...");
        }

        toggleLoading(false);
    }

    async function deleteTransaction(transactionId) {
        toggleLoading(true);

        try {
            const response = await axios.delete(
                `http://localhost:8080/api/v1/my-transactions/${transactionId}`,
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: token,
                    }
                });
            console.log("deleteTransaction:", response);
            setTransactionId(transactionId);
            setStatusMessage("Transactie verwijderd...");
        } catch (e) {
            console.error("deleteTransaction:", e.response.data, e);
            setStatusMessage("Transactie kan niet worden verwijderd...");
        }

        toggleLoading(false);
    }

    return (
        <>
            <PageHeader
                pageTitle="Mijn transacties"
            />
            <div>
                {loading && <p>Loading...</p>}
                {error === false &&
                    <>
                        {transactionData.length > 0 &&
                            transactionData.map((transaction) => {

                                const {
                                    id,
                                    transactionType,
                                    transactionStatusCode,
                                    requester,
                                    provider
                                } = transaction;

                                let myRoleInThisTransaction;
                                let counterParty;
                                if (requester.username === user.username) {
                                    myRoleInThisTransaction = "REQUESTER";
                                    counterParty = provider.username;
                                }
                                if (provider.username === user.username) {
                                    myRoleInThisTransaction = "PROVIDER";
                                    counterParty = requester.username;
                                }

                                return (
                                    <Transaction
                                        key={id}
                                        transactionData={transaction}
                                        role={myRoleInThisTransaction}
                                        children={
                                            <>
                                                {(transactionType === "EXCHANGE_FOR_BOOK"
                                                        && transactionStatusCode === "INITIALIZED"
                                                        && myRoleInThisTransaction === "REQUESTER")
                                                    && <p>Wachten totdat {provider.username} een boek heeft
                                                        geselecteerd...</p>
                                                }
                                                {(transactionType === "EXCHANGE_FOR_BOOK"
                                                        && transactionStatusCode === "INITIALIZED"
                                                        && myRoleInThisTransaction === "PROVIDER")
                                                    && <Button
                                                        text="Selecteer ruilboek"
                                                        icon="fa-solid fa-download"
                                                        onClick={() => history.push(`/select-exchange-book/${id}/${requester.username}`)}
                                                    />
                                                }
                                                {(transactionType === "EXCHANGE_FOR_BOOK"
                                                        && transactionStatusCode === "EXCHANGE_BOOK_SELECTED"
                                                        && myRoleInThisTransaction === "REQUESTER")
                                                    && <Button
                                                        text="Transactie goedkeuren"
                                                        icon="fa-solid fa-circle-check"
                                                        onClick={() => approveTransaction(id)}
                                                    />
                                                }
                                                {(transactionType === "EXCHANGE_FOR_BOOK"
                                                        && transactionStatusCode === "EXCHANGE_BOOK_SELECTED"
                                                        && myRoleInThisTransaction === "PROVIDER")
                                                    && <p>Wachten totdat {requester.username} de transactie
                                                        goedkeurt...</p>
                                                }
                                                {(transactionType === "EXCHANGE_FOR_CAKE"
                                                        && transactionStatusCode === "INITIALIZED"
                                                        && myRoleInThisTransaction === "REQUESTER")
                                                    && <p>Wachten totdat {provider.username} de transactie
                                                        goedkeurt...</p>
                                                }
                                                {(transactionType === "EXCHANGE_FOR_CAKE"
                                                        && transactionStatusCode === "INITIALIZED"
                                                        && myRoleInThisTransaction === "PROVIDER")
                                                    && <Button
                                                        text="Transactie goedkeuren"
                                                        icon="fa-solid fa-circle-check"
                                                        onClick={() => approveTransaction(id)}/>
                                                }
                                                {(transactionType === "GIFT"
                                                        && transactionStatusCode === "INITIALIZED"
                                                        && myRoleInThisTransaction === "REQUESTER")
                                                    && <p>Wachten totdat {provider.username} de transactie
                                                        goedkeurt...</p>
                                                }
                                                {(transactionType === "GIFT"
                                                        && transactionStatusCode === "INITIALIZED"
                                                        && myRoleInThisTransaction === "PROVIDER")
                                                    && <Button
                                                        text="Transactie goedkeuren"
                                                        icon="fa-solid fa-circle-check"
                                                        onClick={() => approveTransaction(id)}
                                                    />
                                                }
                                                {transactionStatusCode === "FINALIZED"
                                                    && <Button
                                                        text="Bekijk contact info"
                                                        icon="fa-solid fa-user"
                                                        onClick={() => history.push(`/user-info/${counterParty}`)}
                                                    />
                                                }
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

export default MyTransactionsPage;