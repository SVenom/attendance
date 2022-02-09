const express = require("express");
const router = express.Router();
const attendanceontroller = require("../controller/attendance_c")

router.get('/', attendanceontroller.getregistration);
router.post('/',attendanceontroller.postregistration)
router.post('/login',attendanceontroller.postlogin)
router.get('/login', attendanceontroller.getlogin);
router.post('/attendance',attendanceontroller.attendanceonpost)
router.get('/viewallattendance',attendanceontroller.viewattendence)
router.get('/viewall',attendanceontroller.viewall)
router.post('/search',attendanceontroller.searchemploye)
router.get('/calender/:email',attendanceontroller.showcalender)
router.get('/test',attendanceontroller.testingroute)

module.exports = router;

