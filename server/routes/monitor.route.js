// routes/monitor.route.js
import express from 'express';
import {
  createMonitorReport,
  getAllMonitorReports,
  getUserMonitorReports,
  getMonitorReportById,
} from '../controllers/monitor.controller.js';
import { protect, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createMonitorReport); // Submit monitor report
router.get('/my-reports', protect, getUserMonitorReports); // Get reports for logged-in user
router.get('/all', protect, isAdmin, getAllMonitorReports); // Admin access to all reports
router.get('/:id', protect, getMonitorReportById); // Get single report by ID

export default router;
