import React, { useEffect, useContext } from "react"
import { useImmer } from "use-immer"
import Page from "./Page"
import StateContext from "../StateContext"
import DispatchContext from "../DIspatchContext"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Axios from "axios"
import { Link } from "react-router-dom"
import Posts from "./Posts"

function Home() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  })


  // rendering home page data on first render
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.post("/getHomeFeed", { token: appState.user.token }, { cancelToken: ourRequest.token })
        setState(draft => {
          draft.isLoading = false
          draft.feed = response.data
        })

      } catch (error) {
        console.log(error)
      }
    }

    fetchData()

    // Clean up function for when the component stops being rendered
    return () => {
      ourRequest.cancel()
    }

  }, [])


  // showing loading icon 
  if (state.isLoading) {
    return <LoadingDotsIcon />
  }

  return (
    <Page title="Your Feed">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">The latest from who you follow</h2>
          <div className="list-group">
            {state.feed.map(post => {
              return <Posts post={post} key={post._id} />
            })}
          </div>
        </>
      )}

      {state.feed.length === 0 && (
        <>
          <h2 className="text-center">Hello <strong>{appState.user.username}</strong>, your feed is empty.</h2>
        <p className="lead text-muted text-center">
          Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.
        </p>
        </>
      )}
    </Page>
  )
}

export default Home