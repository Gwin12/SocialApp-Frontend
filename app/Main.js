import React from "react";
import ReactDOM  from "react-dom/client";
const { useState, useEffect } = React


function ExampleComponent(params) {
    return (
        <div>
            <h2>My App</h2>
            <p>This is my app</p>
        </div>
    )
}


const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<ExampleComponent />)


// Loading new changes on the fly
if (module.hot) {
    module.hot.accept()
}