import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Posts from "./Posts"
import Page from "./Page"
import PageNotFound from "./PageNotFound"


function ProfilePosts() {
    const { username } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])



    // fetching user profile posts when the profile url changes
    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })

                if (response.data) {
                    setPosts(response.data)
                    setIsLoading(false)
                } else {
                    return <Page title="404"><PageNotFound /></Page>
                }


            } catch (error) {
                console.log(error)
            }
        }

        fetchPosts()

        // Clean up function for when the component stops being rendered
        return () => {
            ourRequest.cancel()
        }

    }, [username])

    if (isLoading) return <div><LoadingDotsIcon /></div>

    return (
        <div className="list-group">
            {posts.map((post) => {
                const date = new Date(post.createdDate)
                return <Posts post={post} key={post._id} noAuthor={true} />
            })}
        </div>
    )
}

export default ProfilePosts