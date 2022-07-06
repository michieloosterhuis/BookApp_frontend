import './App.css';
import {Redirect, Route, Switch,} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import Header from "./components/header/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EditMyProfilePage from "./pages/EditMyProfilePage";
import MyBooksPage from "./pages/MyBooksPage";
import EditMyBookPage from "./pages/EditMyBookPage";
import SearchBooksPage from "./pages/SearchBooksPage";
import MyTransactionsPage from "./pages/MyTransactionsPage";
import MyProfilePage from "./pages/MyProfilePage";
import AddBookPage from "./pages/AddBookPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";
import PageWrapper from "./components/pageWrapper/PageWrapper";
import SelectExchangeBookPage from "./pages/SelectExchangeBookPage";
import BookInfoPage from "./pages/BookInfoPage";
import UserInfoPage from "./pages/UserInfoPage";
import {AuthContext} from "./context/AuthContext";
import {useContext} from "react";

function App() {
    const {isAuth} = useContext(AuthContext);

    return (
        <>
            <Header/>

            <PageWrapper>
                <Switch>
                    <Route exact path="/">
                        <HomePage/>
                    </Route>


                    <Route path="/register">
                        <RegisterPage/>
                    </Route>

                    <Route path="/login">
                        <LoginPage/>
                    </Route>


                    <Route path="/my-profile">
                        {isAuth ? <MyProfilePage/> : <Redirect to="/" />}
                    </Route>

                    <Route path="/edit-my-profile">
                        {isAuth ? <EditMyProfilePage/> : <Redirect to="/" />}
                    </Route>


                    <Route path="/my-books">
                        {isAuth ? <MyBooksPage/> : <Redirect to="/" />}
                    </Route>

                    <Route path="/add-book">
                        {isAuth ? <AddBookPage/> : <Redirect to="/" />}
                    </Route>

                    <Route path="/edit-my-book/:bookId">
                        {isAuth ? <EditMyBookPage/> : <Redirect to="/" />}
                    </Route>


                    <Route path="/my-favorites">
                        {isAuth ? <MyFavoritesPage/> : <Redirect to="/" />}
                    </Route>


                    <Route path="/search-books">
                        {isAuth ? <SearchBooksPage/> : <Redirect to="/" />}
                    </Route>

                    <Route path="/book-info/:bookId">
                        {isAuth ? <BookInfoPage/> : <Redirect to="/" />}
                    </Route>

                    <Route path="/user-info/:username">
                        {isAuth ? <UserInfoPage/> : <Redirect to="/" />}
                    </Route>


                    <Route path="/my-transactions">
                        {isAuth ? <MyTransactionsPage/> : <Redirect to="/" />}
                    </Route>

                    <Route path="/select-exchange-book/:transactionId/:requesterUsername">
                        {isAuth ? <SelectExchangeBookPage/> : <Redirect to="/" />}
                    </Route>

                </Switch>
            </PageWrapper>
        </>
    )
        ;
}

export default App;
