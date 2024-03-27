const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const moment = require('moment');
const Appointment = require('../models/appointmentModel');

router.post('/register', async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res
        .status(200)
        .send({ message: 'User already exists', success: false });
    }
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();

    res
      .status(200)
      .send({ message: 'User created successfully', success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: 'Error creating user', success: false, error });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: ' User does not exist', success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .send({ message: 'Password is incorrect', success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      res.status(200).send({
        message: 'Login successful',
        success: true,
        data: token,
        user: user,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: 'Login failed', success: false, error: error });
  }
});

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: 'User does not exist', success: false });
    } else {
      return res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Error getting user info',
      success: false,
      error: error,
    });
  }
});

router.post('/apply-doctor-account', authMiddleware, async (req, res, next) => {
  try {
    const newdoctor = new Doctor({ ...req.body, status: 'pending' });
    await newdoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: 'new-doctor-request',
      message: `${newdoctor.firstName} ${newdoctor.lastName} has requested for a doctor account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + ' ' + newdoctor.lastName,
      },
      onClickPath: '/admin/doctorslist',
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res
      .status(200)
      .send({ success: true, message: 'Success: Doctor account applied' });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error applying doctor account',
      success: false,
      error,
    });
  }
});

router.post(
  '/mark-all-notifications-as-seen',
  authMiddleware,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: 'Success!! Marked all notifications as seen',
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Error! Cannot mark all notifications as seen',
        success: false,
        error,
      });
    }
  }
);
router.post(
  '/delete-all-notifications',
  authMiddleware,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      user.seenNotifications = [];
      user.unseenNotifications = [];
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: 'Success!! Deleted all seen notifications',
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Error! Cannot delete all seen notifications',
        success: false,
        error,
      });
    }
  }
);

router.get('/get-all-approved-doctors', authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'approved' });
    res.status(200).send({
      message: 'Success!! All doctors fetched',
      success: true,
      data: doctors,
    });
    console.log('D', doctors);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error!! Couldn't fetch doctors",
      success: false,
      error,
    });
  }
});

router.post('/book-appointment', authMiddleware, async (req, res) => {
  try {
    req.body.status = 'pending';
    req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    req.body.time = moment(req.body.time, 'HH:mm').toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: 'new-appointment-request',
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: '/doctor/appointments',
    });
    await user.save();
    res.status(200).send({
      message: 'Success! Appointment booked',
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error! Not Booked appointment',
      success: false,
      error,
    });
  }
});

router.post('/check-booking-availability', authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    const fromTime = moment(req.body.time, 'HH:mm')
      .subtract(1, 'hours')
      .toISOString();
    const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: 'Oops! Appointments not available',
        success: false,
      });
    } else {
      return res.status(200).send({
        message: 'Success! Appointments available',
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error booking appointment',
      success: false,
      error,
    });
  }
});

router.get('/get-appointments-by-user-id', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({
      message: 'Appointments fetched successfully',
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching appointments',
      success: false,
      error,
    });
  }
});

module.exports = router;
