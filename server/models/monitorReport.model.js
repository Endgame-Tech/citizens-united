// models/monitorReport.model.js
import mongoose from 'mongoose';

const monitorReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  pollingUnitInfo: {
    code: String,
    name: String,
    ward: String,
    lga: String,
    state: String,
    gpsCoordinates: String,
    locationType: String,
    locationOther: String,
  },

  officerArrival: {
    firstArrivalTime: String,
    lastArrivalTime: String,
    onTimeStatus: String,
    proofTypes: [String],
    arrivalProofMedia: [String],
    arrivalNotes: String,
    officerNames: {
      po: { name: String, photo: String },
      apo1: { name: String, photo: String },
      apo2: { name: String, photo: String },
      apo3: { name: String, photo: String },
    },
    uniformsProper: String,
    impersonators: [{ name: String, photo: String }],
    votingStarted: String,
    actualStartTime: String,
    materialsPresent: [String],
    securityPresent: String
  },

  resultTracking: {
    officerName: String,
    resultAnnouncerPhoto: String,
    partyAgents: [{ name: String, party: String }],
    reporterName: String,
    reporterPhone: String,
    date: String,
    timeAnnounced: String,
    stats: {
      registered: Number,
      accredited: Number,
      valid: Number,
      rejected: Number,
      total: Number,
      votesPerParty: [{ party: String, votes: Number }],
    },
    discrepancies: String,
    signedByAgents: Boolean,
    agentsSignedCount: Number,
    resultPosted: Boolean,
    bvasSeen: String,
    evidence: {
      ec8aPhoto: String,
      announcementVideo: String,
      wallPhoto: String,
      reporterSelfie: String,
    },
    notes: String,
  },

  incidentReport: {
    officerNameOrId: String,
    incidentDate: String,
    incidentStart: String,
    incidentEnd: String,
    captureMethod: [String],
    conditions: String,
    irregularities: [String],
    narrative: String,
    perpetrators: String,
    victims: String,
    officialsPresent: String,
    evidence: {
      photoCount: Number,
      videoCount: Number,
      hasPhoneFootage: Boolean,
      mediaFilenames: [String],
      hasMetadata: Boolean,
    },
    witnesses: [{ name: String, phone: String, consent: Boolean }],
    escalation: {
      reportedTo: [String],
      details: String,
      interventionMade: Boolean,
      outcome: String,
      loggedByINEC: String
    }
  }
}, { timestamps: true });

export const MonitorReport = mongoose.model('MonitorReport', monitorReportSchema);
