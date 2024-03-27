import React from 'react';
import Layout from '../components/Layout';
import { Tabs } from 'antd';
import axios from 'axios';

import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { setUser } from '../redux/userSlice';
import { BASE_URL } from '../config';

function Notifications() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${BASE_URL}/api/user/mark-all-notifications-as-seen`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong');
    }
  };

  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${BASE_URL}/api/user/delete-all-notifications`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong');
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Notifications</h1>
      <hr />

      <Tabs>
        <Tabs.TabPane tab="New" key={0}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={() => markAllAsSeen()}>
              Move to Seen
            </h1>
          </div>

          {user?.unseenNotifications.map((notification) => (
            <div
              className="card p-2 mt-2"
              onClick={() => navigate(notification.onClickPath)}
            >
              <div className="card-text">{notification.message}</div>
              {console.log(notification)}
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Old" key={1}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={() => deleteAll()}>
              Delete All
            </h1>
          </div>
          {user?.seenNotifications.map((notification) => (
            <div
              className="card p-2 mt-2"
              onClick={() => navigate(notification.onClickPath)}
            >
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
}

export default Notifications;
