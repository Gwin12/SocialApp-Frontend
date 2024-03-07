import React, { useEffect } from "react"


// Resuable container for the different pages
function Container(props) {
    return (
        // the ternary operator is checking if the page requires narrow class
        <div className={"container py-md-5 " + (props.wide ? '' : 'container--narrow')}>
            {props.children}
        </div>
    )
}



export default Container