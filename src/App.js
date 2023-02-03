import React, { useState, useEffect } from 'react';
import './style.css';

export default function App() {
  const [selectedPost, setSelectedPost] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const loadPosts = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_page=0&_limit=10'
      );
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        data.map(async (d) => {
          const userResponse = await fetch(
            `https://jsonplaceholder.typicode.com/users/${d?.userId}`
          );
          const usrData = await userResponse.json();
          const post = {
            id: d?.id,
            title: d?.title,
            body: d?.body,
            name: usrData?.name,
            email: usrData?.email,
            phone: usrData?.phone,
            website: usrData?.website,
          };
          setPosts((prevState) => [...prevState, post]);
        });
      }
    };
    loadPosts();
  }, []);

  const openPopup = (id) => {
    const selectedPost = posts.find((post) => post.id === id);
    setSelectedPost(selectedPost);

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((er) => console.log(er));
  };

  const onCancel = () => {
    setComments([]);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center m-5">
        <b> Blog App using React.js and Jsonplaceholder API </b>
      </h1>
      {selectedPost && comments && comments.length > 0 && (
        <>
          <div className="popup">
            <div className="overlay"></div>
            <div
              className="popupBody container"
              style={{ overflowX: 'scroll', height: '400px', width: '400px' }}
            >
              <h2 className="title float-start"> Comments </h2>
              <button className="btn btn-danger float-end" onClick={onCancel}>
                Exit
              </button>
              <br />
              <br />
              <hr />
              {comments.map((comment) => (
                <>
                  <h5>
                    <span className="title">Username:</span> {comment?.name}
                  </h5>
                  <h6>
                    <span className="title">User Email:</span> {comment?.email}
                  </h6>
                  <p>
                    <span className="title">Comment: </span> {comment?.body}
                  </p>
                  <hr />
                </>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="basic-grid">
        {posts &&
          posts.map((user) => (
            <div className="card" key={user.id}>
              <div className="card-header">
                <h4> {user?.title}</h4>
                <p>{user?.body}</p>
              </div>
              <i className="ms-2"> Posted by -</i>
              <div className="card-body">
                <div className="title">{user.name}</div>
                <div className="email">{user.email}</div>
                <div className="phone">{user.phone}</div>
                <div className="web">{user.website}</div>
              </div>

              <div className="row_group">
                <div className="item">
                  <button onClick={openPopup.bind(this, user.id)}>
                    See Comments
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
