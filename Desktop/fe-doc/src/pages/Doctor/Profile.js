import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import DoctorForm from '../../components/DoctorForm';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import { BASE_URL } from '../../config';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);

  async function onFinish(values) {
    console.log('V', values);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${BASE_URL}/api/doctor/update-doctor-profile`,
        {
          ...values,
          userId: params.userId,
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

  async function getDoctorData() {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${BASE_URL}/api/doctor/get-doctor-info-by-user-id`,
        { userId: user._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  }

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Doctor Card</h1>
      <hr />
      {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
    </Layout>
  );
}

export default Profile;
