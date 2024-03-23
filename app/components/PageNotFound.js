import React from "react"
import Page from "./Page"
import { Link } from "react-router-dom"

function PageNotFound() {
    return (
        <Page title="404">
            <div className="text-center">
                <h2>Whoops, can't find that page</h2>
                <p className="lead text-muted">You can always visit the <Link to='/'>homepage</Link></p>
            </div>
        </Page>
    )
}

export default PageNotFound