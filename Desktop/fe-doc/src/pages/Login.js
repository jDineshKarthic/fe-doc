import { Button, Form, Input } from 'antd';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { setUser } from '../redux/userSlice';
import { BASE_URL } from '../config';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.alerts);
  console.log(loading);

  async function onFinish(values) {
    console.log(values);
    try {
      dispatch(showLoading());
      const response = await axios.post(`${BASE_URL}/api/user/login`, values);
      console.log(response.data);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('token', response.data.data);
        dispatch(setUser(response.data.user));
        navigate('/');
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
        <h1 className="card-title">Sign In</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Button className="primary-button my-2" htmlType="submit">
            Sign In
          </Button>
          <Link to="/register" className="anchor">
            Don't have an account? Sign Up
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;
