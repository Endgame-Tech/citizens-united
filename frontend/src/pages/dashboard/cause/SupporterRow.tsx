// import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';

type Supporter = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  joinStatus: string;
  decisionTag: string;
  contactStatus: string;
  notes: string;
};
type Props = {
  supporter: Supporter;
  onUpdate: (updates: Partial<Supporter>) => void;
};

export default function SupporterRow({ supporter, onUpdate }: Props) {
  const getStatusBadgeStyles = (status: string, type: 'join' | 'decision' | 'contact') => {
    switch (type) {
      case 'join':
        return {
          Pending: 'bg-yellow-100 text-yellow-800',
          Joined: 'bg-green-100 text-green-800',
          Active: 'bg-blue-100 text-blue-800',
        }[status] || 'bg-gray-100 text-gray-800';
      case 'decision':
        return {
          Undecided: 'bg-gray-100 text-gray-800',
          'Not-interested': 'bg-red-100 text-red-800',
          Committed: 'bg-green-100 text-green-800',
          Voted: 'bg-blue-100 text-blue-800',
        }[status] || 'bg-gray-100 text-gray-800';
      case 'contact':
        return {
          'Not Reachable': 'bg-red-100 text-red-800',
          'Messaged recently': 'bg-green-100 text-green-800',
          'Called recently': 'bg-blue-100 text-blue-800',
          'No Response': 'bg-gray-100 text-gray-800',
        }[status] || 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors animate-fade-in"
    >
      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
        {supporter.name}
      </td>
      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.open(`mailto:${supporter.email}`)}
            className="p-2 bg-[#006837]/10 rounded-full hover:scale-110 transition-transform"
            aria-label={`Email ${supporter.name}`}
          >
            <Mail className="w-4 h-4 text-[#006837]" />
          </button>
          <button
            onClick={() => window.location.href = `tel:${supporter.phone}`}
            className="p-2 bg-[#006837]/10 rounded-full hover:scale-110 transition-transform"
            aria-label={`Call ${supporter.name}`}
          >
            <Phone className="w-4 h-4 text-[#006837]" />
          </button>
          <span className="truncate max-w-[150px]">{supporter.email}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        <select
          value={supporter.joinStatus}
          onChange={e => onUpdate({ joinStatus: e.target.value })}
          className={`px-2 py-1 rounded-lg text-sm font-medium ${getStatusBadgeStyles(
            supporter.joinStatus,
            'join'
          )} focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition`}
          aria-label="Join status"
          role="combobox"
        >
          <option value="Pending">Pending</option>
          <option value="Joined">Joined</option>
          <option value="Active">Active</option>
        </select>
      </td>
      <td className="px-4 py-3 text-sm">
        <select
          value={supporter.decisionTag}
          onChange={e => onUpdate({ decisionTag: e.target.value })}
          className={`px-2 py-1 rounded-lg text-sm font-medium ${getStatusBadgeStyles(
            supporter.decisionTag,
            'decision'
          )} focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition`}
          aria-label="Decision status"
          role="combobox"
        >
          <option value="Undecided">Undecided</option>
          <option value="Not-interested">Not-interested</option>
          <option value="Committed">Committed</option>
          <option value="Voted">Voted</option>
        </select>
      </td>
      <td className="px-4 py-3 text-sm">
        <select
          value={supporter.contactStatus}
          onChange={e => onUpdate({ contactStatus: e.target.value })}
          className={`px-2 py-1 rounded-lg text-sm font-medium ${getStatusBadgeStyles(
            supporter.contactStatus,
            'contact'
          )} focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition`}
          aria-label="Contact status"
          role="combobox"
        >
          <option value="Not Reachable">Not Reachable</option>
          <option value="Messaged recently">Messaged recently</option>
          <option value="Called recently">Called recently</option>
          <option value="No Response">No Response</option>
        </select>
      </td>
      <td className="px-4 py-3 text-sm">
        <textarea
          value={supporter.notes}
          onChange={e => onUpdate({ notes: e.target.value })}
          placeholder="Add notes..."
          className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition resize-none text-gray-900 dark:text-gray-100"
          rows={2}
          aria-label={`Notes for ${supporter.name}`}
        />
      </td>
      <td className="px-4 py-3 text-sm">
        <button
          onClick={() => window.location.href = `https://wa.me/${supporter.phone}`}
          className="p-2 bg-[#006837]/10 rounded-full hover:scale-110 transition-transform"
          aria-label={`Message ${supporter.name} on WhatsApp`}
        >
          <MessageCircle className="w-5 h-5 text-[#006837]" />
        </button>
      </td>
    </tr>
  );
}