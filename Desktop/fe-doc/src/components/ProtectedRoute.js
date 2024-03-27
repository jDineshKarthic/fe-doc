// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Navigate, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { setUser } from '../redux/userSlice';
// import { hideLoading, showLoading } from '../redux/alertsSlice';

// function ProtectedRoute(props) {
//   const { user } = useSelector((state) => state.user);
//   console.log('ProtectedRoute', user);
//   const dispatch = useDispatch();

//   const navigate = useNavigate();

//   async function getUser() {
//     try {
//       dispatch(showLoading());
//       const response = await axios.post(
//         '/api/user/get-user-info-by-id',
//         { token: localStorage.getItem('token') },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
//       dispatch(hideLoading());
//       if (response.data.success) {
//         console.log('Response', response.data);
//         dispatch(setUser(response.data.data));
//       } else {
//         localStorage.clear();
//         navigate('/login');
//       }
//     } catch (error) {
//       dispatch(hideLoading());
//       localStorage.clear();
//       navigate('/login');
//     }
//   }

//   useEffect(() => {
//     if (!user) {
//       getUser();
//     }
//   }, [user]);

//   if (localStorage.getItem('token')) {
//     return props.children;
//   } else {
//     return <Navigate to="/login" />;
//   }
// }

// export default ProtectedRoute;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../redux/userSlice';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { BASE_URL } from '../config';

function ProtectedRoute(props) {
  const { user } = useSelector((state) => state.user);
  const [isUserLoaded, setIsUserLoaded] = useState(false); // Add a state to track if the user is loaded
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function getUser() {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${BASE_URL}/api/user/get-user-info-by-id`,
        { token: localStorage.getItem('token') },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      } else {
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      navigate('/login');
    } finally {
      setIsUserLoaded(true); // Set isUserLoaded to true once the user data is fetched
    }
  }

  useEffect(() => {
    if (!user) {
      getUser();
    } else {
      setIsUserLoaded(true); // If user is already loaded from Redux store, set isUserLoaded to true
    }
  }, [user]);

  // Check if user is loaded, if not, show loading spinner or something else
  if (!isUserLoaded) {
    return (
      <div className="spinner-parent">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  // Check if user is authenticated, if yes, render the children, otherwise redirect to login
  if (localStorage.getItem('token')) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
