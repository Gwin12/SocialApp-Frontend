import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfileFollowing() {
    const { username } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])


    
    // fetching user profile posts when the profile url changes
    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/following`, {cancelToken: ourRequest.token})

                setPosts(response.data)
                setIsLoading(false)

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
            {posts.map((follower, index) => {
                return (
                    <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
                    </Link>
                )
            })}
        </div>
    )
}

export default ProfileFollowing