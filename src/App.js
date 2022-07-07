import './App.css';
import {Redirect, Route, Switch,} from 'react-router-dom';
import HomePage from "./pages/homePage/HomePage";
import Header from "./components/header/Header";
import LoginPage from "./pages/loginPage/LoginPage";
import RegisterPage from "./pages/registerPage/RegisterPage";
import EditMyProfilePage from "./pages/editMyProfilePage/EditMyProfilePage";
import MyBooksPage from "./pages/myBooksPage/MyBooksPage";
import EditMyBookPage from "./pages/editMyBookPage/EditMyBookPage";
import SearchBooksPage from "./pages/searchBooksPage/SearchBooksPage";
import MyTransactionsPage from "./pages/myTransactionsPage/MyTransactionsPage";
import MyProfilePage from "./pages/myProfilePage/MyProfilePage";
import AddBookPage from "./pages/addBookPage/AddBookPage";
import MyFavoritesPage from "./pages/myFavoritesPage/MyFavoritesPage";
import PageWrapper from "./components/pageWrapper/PageWrapper";
import SelectExchangeBookPage from "./pages/selectExchangeBookPage/SelectExchangeBookPage";
import BookInfoPage from "./pages/bookInfoPage/BookInfoPage";
import UserInfoPage from "./pages/userInfoPage/UserInfoPage";
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
