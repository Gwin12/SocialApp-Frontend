import React, { useEffect, useState } from "react"
import Page from "./Page"
import { useParams, Link } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import { Tooltip as ReactToolTip } from "react-tooltip"
import PageNotFound from "./PageNotFound"



function ViewSinglePost() {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState(true)


  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {cancelToken: ourRequest.token})

        setPost(response.data)
        setIsLoading(false)

      } catch (error) {
        console.log(error)
      }
    }

    fetchPost()

    // Clean up function for when the component stops being rendered
    return () => {
      ourRequest.cancel()
    }

  }, [])



  if (!isLoading && !post) return <Page title="404"><PageNotFound /></Page>   //if no post data was found
  if (isLoading) return <Page title="..."><LoadingDotsIcon /></Page>


  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link to={`/post/${post._id}/edit`} data-tooltip-content="Edit" data-tooltip-id="edit" className="text-primary mr-2"><i className="fas fa-edit"></i></Link>
          <ReactToolTip id="edit" className="custom-tooltip" />{" "}
          
          <Link data-tooltip-content="Delete" data-tooltip-id="delete" className="delete-post-button text-danger"><i className="fas fa-trash"></i></Link>
          <ReactToolTip id="delete" className="custom-tooltip" />

        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username} </Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "li"]} />   
      </div>
    </Page>
  )
}

export default ViewSinglePost