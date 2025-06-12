import mongoose from 'mongoose';
const { Schema } = mongoose;

// Sub-schema: Personal Information  
const PersonalInfoSchema = new Schema({
  first_name: { type: String },
  middle_name: { type: String },
  last_name: { type: String },
  user_name: { type: String },
  phone_number: { type: String },
  country_code: { type: String },
  gender: { type: String },
  lga: { type: String },
  ward: { type: String },
  age_range: { type: String },
  state_of_origin: { type: String },
  voting_engagement_state: { type: String },
  // Add survey fields
  citizenship: { type: String, enum: ['', 'Nigerian Citizen', 'Diasporan', 'Foreigner'], default: '' },
  isVoter: { type: String, enum: ['', 'Yes', 'No'], default: '' },
  willVote: { type: String, enum: ['', 'Yes', 'No'], default: '' },
}, { _id: false });

// Sub-schema: Onboarding Data
const OnboardingDataSchema = new Schema({
  securityValidation: {
    profile_picture_url: { type: String },
  },
  demographics: {
    ethnicity: { type: String },
    religion: { type: String },
    occupation: { type: String },
    level_of_education: { type: String },
    marital_status: { type: String },
  },
  politicalPreferences: {
    party_affiliation: { type: String },
  },
  engagementAndMobilization: {
    is_volunteering: { type: String },
    past_election_participation: { type: String },
  },
  votingBehavior: {
    likely_to_vote: { type: String },
    is_registered: { type: String },
    registration_date: { type: String },
  },
}, { _id: false });

// Sub-schema: Valid ID Info
const ValidIDSchema = new Schema({
  idType: {
    type: String,
    enum: ['NIN', 'Driver\'s License', 'International Passport'],
  },
  idNumber: { type: String },
  idImageUrl: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    profileImage: { type: String, default: '' },

    emailVerified: { type: Boolean, default: false },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    kycStatus: {
      type: String,
      enum: ['unsubmitted', 'pending', 'approved', 'rejected'],
      default: 'unsubmitted',
    },


    kycRejectionReason: { type: String },

    personalInfo: { type: PersonalInfoSchema, default: {} },
    onboardingData: { type: OnboardingDataSchema, default: {} },

    selfieImageUrl: { type: String },
    validID: { type: ValidIDSchema, default: {} },
    joinedCauses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cause' }],
    ownedCauses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cause' }],
    hasTakenCauseSurvey: { type: Boolean, default: false },
    country_of_residence: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
