import express from 'express'; 

const router = express.Router();

import {
  registerUser,
  loginUser,
  verify,
  logoutUser,
  forgotPassword,
  verifyOTP,
  changePassword,
  allUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
  resetPasswordWithOTP,
  getUpkendraPrapatraOne,
  getUpkendraPrapatraThree,
  getUpkendraPrapatraTwo,
  saveUpkendraPrapatraOne,
  saveUpkendraPrapatraThree,
  saveUpkendraPrapatraTwo,
} from '../Controllers/userController.js';
import { isAdmin, isAuthenticated } from '../Middleware/isAuthenticated.js';

router.post('/register', isAuthenticated, isAdmin, registerUser);
router.post('/login', loginUser);
router.post('/verify', verify);
router.post('/logout',isAuthenticated, logoutUser);
router.get('/me', isAuthenticated, getCurrentUser);
router.get('/upkendra-prapatra-1', isAuthenticated, getUpkendraPrapatraOne);
router.post('/upkendra-prapatra-1', isAuthenticated, saveUpkendraPrapatraOne);
router.get('/upkendra-prapatra-2', isAuthenticated, getUpkendraPrapatraTwo);
router.post('/upkendra-prapatra-2', isAuthenticated, saveUpkendraPrapatraTwo);
router.get('/upkendra-prapatra-3', isAuthenticated, getUpkendraPrapatraThree);
router.post('/upkendra-prapatra-3', isAuthenticated, saveUpkendraPrapatraThree);
router.post('/forgot-password', forgotPassword);
router.post('/verify-OTP/:email', verifyOTP);
router.post('/reset-password', resetPasswordWithOTP);
router.post('/change-password', isAuthenticated, changePassword);
router.get('/all-users',isAuthenticated,isAdmin, allUsers);
router.get('/get-user/:id',isAuthenticated, getUserById);
router.put('/:id', isAuthenticated, isAdmin, updateUser);
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

export default router;
