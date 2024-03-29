import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from 'use-immer'    // Allows modifying of state data directly
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";
Axios.defaults.baseURL = "http://localhost:8080";



// context
import StateContext from "./StateContext";
import DispatchContext from "./DIspatchContext";

// Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import PageNotFound from "./components/PageNotFound";
import Search from "./components/Search";
import Chat from "./components/Chat";



function Main() {
    let username, token, avatar, userData;
    userData = localStorage.getItem("userData")

    if (userData) {
        userData = JSON.parse(userData)
        username = userData.username
        token = userData.token
        avatar = userData.avatar

    } else {
        username = '', token = '', avatar = ''
    }


    const initialState = {
        loggedIn: Boolean(localStorage.getItem("userData")),
        flashMessages: [],
        user: { token, username, avatar },
        isSearchOpen: false,
        isChatOpen: false,
        unReadChatCount: 0
    }



    // using useReducer instead off states
    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true
                draft.user = action.userData
                break

            case "logout":
                draft.loggedIn = false
                break

            case "flashMessage":
                draft.flashMessages.push(action.value)
                break

            case "openSearch":
                draft.isSearchOpen = true
                break

            case "closeSearch":
                draft.isSearchOpen = false
                break

            case "toggleChat":
                draft.isChatOpen = !draft.isChatOpen
                break

            case "closeChat":
                draft.isChatOpen = false
                break

            case "incrementUnreadChatCount":
                draft.unReadChatCount++
                break

            case "clearUnreadChatCount":
                draft.unReadChatCount = 0
                break

            default:
                break;
        }
    }


    const [state, dispatch] = useImmerReducer(ourReducer, initialState)


    // adding userdata in local storage whenever they log in our out 
    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("userData", JSON.stringify(state.user))
        } else {
            localStorage.removeItem("userData")
        }

    }, [state.loggedIn])



    // check if token has expired on first render
    useEffect(() => {
        if (state.loggedIn) {
            const ourRequest = Axios.CancelToken.source()

            async function fetchResult() {
                try {
                    const response = await Axios.post('/checkToken', { token: state.user.token }, { cancelToken: ourRequest.token })

                    if (!response.data) {
                        dispatch({type: 'logout'})
                        dispatch({type: 'flashMessage', value: 'Your session has expired. Please login again.'})
                    }

                } catch (error) {
                    console.log(error)
                }
            }

            fetchResult()
            return () => ourRequest.cancel()
        }

    }, [])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />

                    <Header />
                    <Routes>
                        <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
                        <Route path="/profile/:username/*" element={<Profile />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/post/:id" element={<ViewSinglePost />} />
                        <Route path="/post/:id/edit" element={<EditPost />} />
                        <Route path="/about-us" element={<About />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="*" element={<PageNotFound />} />

                    </Routes>

                    <Chat />
                    <Footer />

                    <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
                        <Search />
                    </CSSTransition>

                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}


const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)


// Loading new changes on the fly
if (module.hot) {
    module.hot.accept()
}