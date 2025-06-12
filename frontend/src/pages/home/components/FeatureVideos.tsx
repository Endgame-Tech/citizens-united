// This file contains placeholder data for feature videos/images
// In production, replace these with actual video assets

export interface FeatureVideoData {
  id: string;
  title: string;
  description: string;
  placeholder: string; // This would be replaced with actual video URLs in production
}

const featureVideos: FeatureVideoData[] = [
  {
    id: "ask-tolu",
    title: "Ask Tolu (Civic AI Assistant)",
    description: "Get instant answers about government policies, elections, and civic processes with our AI assistant.",
    placeholder: "/ToluCivicAI.mov"
  },
  {
    id: "state-of-governance",
    title: "State of Governance Dashboards",
    description: "Visualize key metrics and track real-time performance of government at all levels.",
    placeholder: "/StateOfNation.mov"
  },
  {
    id: "my-leaders",
    title: "My Leaders",
    description: "Connect with your representatives, view their records, and hold them accountable.",
    placeholder: "/MyLeaders.mov"
  }
];

export default featureVideos;
