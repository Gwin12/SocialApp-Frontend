import React, { useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { useImmer } from "use-immer"
import StateContext from "../StateContext"
import ProfilePosts from "./ProfilePosts"
import Page from "./Page"
import Axios from "axios"


function Profile() {
    const { username } = useParams()
    const appState = useContext(StateContext)
    const [state, setState] = useImmer({
        followActionLoading: false,
        startFollowRequestCount: 0,
        stopFollowRequestCount: 0,
        profileData: {
            profileUsername: "...",
            profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
            isFollowing: false,
            counts: { postCount: "", followerCount: "", followingCount: "" }
        }
    })



    // fetching user profile data when the profile url changes
    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
                setState(draft => {
                    draft.profileData = response.data
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

    }, [username])



    // sending an follow axios request when follow request count increases
    useEffect(() => {
        if (state.startFollowRequestCount) {
            setState(draft => {
                draft.followActionLoading = true
            })

            const ourRequest = Axios.CancelToken.source()

            async function fetchData() {
                try {
                    const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
                    setState(draft => {
                        draft.profileData.isFollowing = true
                        draft.profileData.counts.followerCount++
                        draft.followActionLoading = false
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
        }

    }, [state.startFollowRequestCount])



    // sending an unfollow axios request when follow request count decreases
    useEffect(() => {
        if (state.stopFollowRequestCount) {
            setState(draft => {
                draft.followActionLoading = true
            })

            const ourRequest = Axios.CancelToken.source()

            async function fetchData() {
                try {
                    const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
                    setState(draft => {
                        draft.profileData.isFollowing = false
                        draft.profileData.counts.followerCount--
                        draft.followActionLoading = false
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
        }

    }, [state.stopFollowRequestCount])


    // increment follow request count when the user clicks on the follow btn
    function startFollowing() {
        setState(draft => {
            draft.startFollowRequestCount++
        })
    }


    // decrement follow request count when the user clicks on the follow btn
    function stopFollowing() {
        setState(draft => {
            draft.stopFollowRequestCount++
        })
    }

    return (
        <Page title="Profile ">
            <h2>
                <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}

                {appState.loggedIn && !state.profileData.isFollowing && appState.user.username !== state.profileData.profileUsername && state.profileData.profileUsername !== '...' && (
                    <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
                )}

                {appState.loggedIn && state.profileData.isFollowing && appState.user.username !== state.profileData.profileUsername && state.profileData.profileUsername !== '...' && (
                    <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">Unfollow <i className="fas fa-user-times"></i></button>
                )}

            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <a href="#" className="active nav-item nav-link">
                    Posts: {state.profileData.counts.postCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Followers: {state.profileData.counts.followerCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Following: {state.profileData.counts.followingCount}
                </a>
            </div>

            <ProfilePosts />

        </Page>
    )
}

export default Profile