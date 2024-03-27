import React from 'react';
import Layout from '../components/Layout';
// import { Button, Col, Form, Input, Row, TimePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { showLoading, hideLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DoctorForm from '../components/DoctorForm';
import moment from 'moment';
import { BASE_URL } from '../config';

function ApplyDoctor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  async function onFinish(values) {
    console.log('HELLO');
    console.log(values);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${BASE_URL}/api/user/apply-doctor-account`,
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format('HH:mm'),
            moment(values.timings[1]).format('HH:mm'),
          ],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
      console.log(response.data);
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error('Something went wrong!');
    }
  }
  return (
    <Layout className="page-title">
      <h1>Apply Doctor</h1>
      <DoctorForm onFinish={onFinish} />
    </Layout>
  );
}

export default ApplyDoctor;
