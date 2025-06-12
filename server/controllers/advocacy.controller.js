import { Advocacy } from '../models/advocacy.model.js';
import cloudinary from '../config/cloudinary.js';

export const createAdvocacy = async (req, res) => {
  const { title, description, goals, toolkits, displayImage } = req.body;
  const advocacy = await Advocacy.create({
    title,
    description,
    goals,
    toolkits,
    displayImage,
    createdBy: req.user._id,
  });
  res.status(201).json(advocacy);
};

export const uploadAdvocacyImage = async (req, res) => {
  try {
    const fileStr = req.file.path;
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: 'advocacy_images',
      transformation: [{ width: 1200, height: 675, crop: 'fill' }],
    });
    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
};

export const getAllAdvocacies = async (req, res) => {
  const campaigns = await Advocacy.find().sort({ createdAt: -1 });
  res.json(campaigns);
};

export const getAdvocacyById = async (req, res) => {
  const campaign = await Advocacy.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Not found' });
  res.json(campaign);
};

export const updateAdvocacy = async (req, res) => {
  const { title, description, goals, toolkits, displayImage } = req.body;
  const campaign = await Advocacy.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Not found' });

  campaign.title = title ?? campaign.title;
  campaign.description = description ?? campaign.description;
  campaign.goals = goals ?? campaign.goals;
  campaign.toolkits = toolkits ?? campaign.toolkits;
  campaign.displayImage = displayImage ?? campaign.displayImage;

  await campaign.save();
  res.json(campaign);
};

export const deleteAdvocacy = async (req, res) => {
  const campaign = await Advocacy.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Not found' });
  await campaign.deleteOne();
  res.json({ message: 'Advocacy deleted successfully' });
};

export const updateAdvocacyResources = async (req, res) => {
  const campaign = await Advocacy.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Not found' });
  campaign.toolkits = req.body.toolkits || [];
  await campaign.save();
  res.json(campaign);
};
