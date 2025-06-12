// controllers/monitor.controller.js
import { MonitorReport } from '../models/monitorReport.model.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'auto',
    folder: 'monitor-reports',
  });
  return result.secure_url;
};

export const createMonitorReport = async (req, res) => {
  try {
    const { files, body } = req;

    // Helper: safely parse JSON-encoded fields (frontend should send arrays as JSON strings)
    const parseJSON = (field) => {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    };

    // Handle and upload file fields
    const fileUrls = {};

    // General media mapping
    const uploadMapping = {
      'officerArrival.arrivalProofMedia': files?.arrivalProofMedia,
      'officerArrival.officerNames.po.photo': files?.poPhoto?.[0],
      'officerArrival.officerNames.apo1.photo': files?.apo1Photo?.[0],
      'officerArrival.officerNames.apo2.photo': files?.apo2Photo?.[0],
      'officerArrival.officerNames.apo3.photo': files?.apo3Photo?.[0],
      'officerArrival.impersonators': files?.impersonatorPhotos, // multiple
      'resultTracking.resultAnnouncerPhoto': files?.resultAnnouncerPhoto?.[0],
      'resultTracking.evidence.ec8aPhoto': files?.ec8aPhoto?.[0],
      'resultTracking.evidence.announcementVideo': files?.announcementVideo?.[0],
      'resultTracking.evidence.wallPhoto': files?.wallPhoto?.[0],
      'resultTracking.evidence.reporterSelfie': files?.reporterSelfie?.[0],
    };

    for (const [path, upload] of Object.entries(uploadMapping)) {
      if (Array.isArray(upload)) {
        const uploadedUrls = [];
        for (const file of upload) {
          const url = await uploadToCloudinary(file.path);
          uploadedUrls.push(url);
        }
        fileUrls[path] = uploadedUrls;
      } else if (upload) {
        const url = await uploadToCloudinary(upload.path);
        fileUrls[path] = url;
      }
    }

    // Convert flattened paths into nested object
    const mergeFilesIntoBody = (obj, path, value) => {
      const keys = path.split('.');
      let current = obj;
      keys.forEach((key, idx) => {
        if (idx === keys.length - 1) {
          current[key] = value;
        } else {
          if (!current[key]) current[key] = {};
          current = current[key];
        }
      });
    };

    for (const [path, value] of Object.entries(fileUrls)) {
      mergeFilesIntoBody(body, path, value);
    }

    // Parse fields that were JSON-stringified (for nested fields/arrays)
    if (body['officerArrival.proofTypes']) {
      mergeFilesIntoBody(body, 'officerArrival.proofTypes', parseJSON(body['officerArrival.proofTypes']));
    }
    if (body['officerArrival.materialsPresent']) {
      mergeFilesIntoBody(body, 'officerArrival.materialsPresent', parseJSON(body['officerArrival.materialsPresent']));
    }
    if (body['officerArrival.impersonators']) {
      const names = parseJSON(body['officerArrival.impersonators']);
      const photos = fileUrls['officerArrival.impersonators'] || [];
      const impersonators = names.map((name, i) => ({ name, photo: photos[i] || '' }));
      mergeFilesIntoBody(body, 'officerArrival.impersonators', impersonators);
    }

    if (body['resultTracking.partyAgents']) {
      mergeFilesIntoBody(body, 'resultTracking.partyAgents', parseJSON(body['resultTracking.partyAgents']));
    }
    if (body['resultTracking.stats.votesPerParty']) {
      mergeFilesIntoBody(body, 'resultTracking.stats.votesPerParty', parseJSON(body['resultTracking.stats.votesPerParty']));
    }
    if (body['incidentReport.captureMethod']) {
      mergeFilesIntoBody(body, 'incidentReport.captureMethod', parseJSON(body['incidentReport.captureMethod']));
    }
    if (body['incidentReport.irregularities']) {
      mergeFilesIntoBody(body, 'incidentReport.irregularities', parseJSON(body['incidentReport.irregularities']));
    }
    if (body['incidentReport.witnesses']) {
      mergeFilesIntoBody(body, 'incidentReport.witnesses', parseJSON(body['incidentReport.witnesses']));
    }
    if (body['incidentReport.escalation.reportedTo']) {
      mergeFilesIntoBody(body, 'incidentReport.escalation.reportedTo', parseJSON(body['incidentReport.escalation.reportedTo']));
    }

    const report = await MonitorReport.create({
      ...body,
      user: req.userId,
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating monitor report:', error);
    res.status(500).json({ message: 'Failed to create monitor report' });
  }
};

export const getAllMonitorReports = async (req, res) => {
  try {
    const reports = await MonitorReport.find().populate('user', 'name email');
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

export const getUserMonitorReports = async (req, res) => {
  try {
    const reports = await MonitorReport.find({ user: req.userId });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ message: 'Failed to fetch your reports' });
  }
};

export const getMonitorReportById = async (req, res) => {
  try {
    const report = await MonitorReport.findById(req.params.id).populate('user', 'name email');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Failed to fetch report' });
  }
};
