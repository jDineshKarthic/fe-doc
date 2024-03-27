import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Badge } from 'antd';

import '../layout.css';

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);

  const userMenu = [
    {
      name: 'Home',
      path: '/',
      icon: 'ri-home-heart-line',
    },
    {
      name: 'Bookings',
      path: '/appointments',
      icon: 'ri-booklet-line',
    },
    {
      name: 'Register',
      path: '/apply-doctor',
      icon: 'ri-user-heart-line',
    },
  ];
  const adminMenu = [
    {
      name: 'Home',
      path: '/',
      icon: 'ri-home-heart-line',
    },
    {
      name: 'Users',
      path: '/admin/userslist',
      icon: 'ri-team-line',
    },
    {
      name: 'Doctors',
      path: '/admin/doctorslist',
      icon: 'ri-nurse-line',
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: 'ri-user-heart-line',
    },
  ];

  const doctorMenu = [
    {
      name: 'Home',
      path: '/',
      icon: 'ri-home-heart-line',
    },
    {
      name: 'Bookings',
      path: '/doctor/appointments',
      icon: 'ri-booklet-line',
    },
    {
      name: 'Profile',
      path: `/doctor/profile/${user?._id}`,
      icon: 'ri-user-heart-line',
    },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  const role = user?.isAdmin ? 'Admin' : user?.isDoctor ? 'Doctor' : 'User';

  return (
    <div className="main">
      <div className="d-flex layout">
        <div className={'sidebar'}>
          <div className="sidebar-header">{/* <h1>{role}</h1> */}</div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && 'active-menu-item'
                  }`}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className={`d-flex menu-item`}
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
            >
              <i className={'ri-login-circle-line'}></i>
              {!collapsed && <Link to={'/login'}>Sign Out</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-arrow-right-double-line header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-arrow-left-double-line header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotifications.length}
                offset={[-12, 3]}
                onClick={() => navigate('/notifications')}
              >
                <i
                  className="ri-mail-line header-action-icon px-3"
                  style={{ paddingLeft: '-10px' }}
                ></i>
              </Badge>

              <Link className="anchor mx-3" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;

// {
//     name: 'Sign Out',
//     path: '/logout',
//     icon: 'ri-login-circle-line',
//   },
