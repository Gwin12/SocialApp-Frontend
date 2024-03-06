import React from "react";
import ReactDOM from "react-dom/client";
const { useState, useEffect } = React


// Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";


function Main() {
    return (
        <>
            <Header />            
            <HomeGuest />
            <Footer />
        </>
    )
}


const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)


// Loading new changes on the fly
if (module.hot) {
    module.hot.accept()
}