import { Button, Form, Input } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { BASE_URL } from '../config';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function onFinish(values) {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${BASE_URL}/api/user/register`,
        values
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error('Something went wrong!');
    }
  }
  return (
    <div className="authentication">
      <div className="authentication-form card p-4">
        <h1 className="card-title">Sign Up</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Button className="primary-button my-2" htmlType="submit">
            Sign Up
          </Button>
          <Link to="/login" className="anchor">
            Already have an account? Log In
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;
