'use client';

import React from 'react';
import { Observation } from '@/lib/types';
import { CATEGORIES, SEVERITIES, STATUSES, formatDate } from '@/lib/constants';

interface PrintReportViewProps {
  observation: Observation;
}

export function PrintReportView({ observation }: PrintReportViewProps) {
  const cat = CATEGORIES[observation.category] || CATEGORIES.SAF;
  const sev = SEVERITIES[observation.severity] || SEVERITIES.Medium;
  const stat = STATUSES[observation.status] || STATUSES.Open;

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans leading-normal">
      {/* Official Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex items-start justify-between">
        <div>
          <div className="text-xl font-bold uppercase tracking-wider">
            ORL · METRO RAIL TRANSIT OPERATIONS
          </div>
          <div className="text-sm font-semibold text-gray-700">
            OFFICIAL SITE OBSERVATION &amp; AUDIT REPORT
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Standard Compliance Form SOMS-ENG-F09 · Rev. 3.2
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-lg font-bold border border-black px-3 py-1 inline-block">
            {observation.id}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Generated: {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>

      {/* Primary Metadata Table */}
      <table className="w-full border-collapse border border-gray-400 text-xs mb-6">
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="p-2 font-bold bg-gray-100 w-1/4 border-r border-gray-300">Category:</td>
            <td className="p-2 w-1/4 border-r border-gray-300 font-semibold">{cat.label} ({observation.category})</td>
            <td className="p-2 font-bold bg-gray-100 w-1/4 border-r border-gray-300">Severity Level:</td>
            <td className="p-2 w-1/4 font-bold">{observation.severity} (SLA: {sev.slaHours}h)</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 font-bold bg-gray-100 border-r border-gray-300">Current Status:</td>
            <td className="p-2 border-r border-gray-300 font-bold uppercase">{observation.status}</td>
            <td className="p-2 font-bold bg-gray-100 border-r border-gray-300">Logged Timestamp:</td>
            <td className="p-2">{formatDate(observation.createdAt)}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 font-bold bg-gray-100 border-r border-gray-300">Site / Location:</td>
            <td className="p-2 border-r border-gray-300">{observation.site}</td>
            <td className="p-2 font-bold bg-gray-100 border-r border-gray-300">Chainage / Station:</td>
            <td className="p-2">{observation.locationChainage || observation.station || '—'}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 font-bold bg-gray-100 border-r border-gray-300">Asset / Sub-system:</td>
            <td className="p-2 border-r border-gray-300">{observation.asset || 'N/A'}</td>
            <td className="p-2 font-bold bg-gray-100 border-r border-gray-300">Target Closure:</td>
            <td className="p-2 font-semibold">{observation.dueDate || 'Standard SLA'}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold bg-gray-100 border-r border-gray-300">Observed By:</td>
            <td className="p-2 border-r border-gray-300">{observation.observedBy}</td>
            <td className="p-2 font-bold bg-gray-100 border-r border-gray-300">Closed By:</td>
            <td className="p-2">{observation.closedBy ? `${observation.closedBy} (${formatDate(observation.closedAt || '')})` : 'Pending Verification'}</td>
          </tr>
        </tbody>
      </table>

      {/* Description */}
      <div className="mb-6 border border-gray-300 p-4 rounded-sm">
        <div className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2 border-b pb-1">
          Finding Description &amp; Initial Risk Assessment:
        </div>
        <div className="text-xs text-gray-900 whitespace-pre-wrap leading-relaxed">
          {observation.description}
        </div>
      </div>

      {/* Evidence Photos */}
      {observation.photos && observation.photos.length > 0 && (
        <div className="mb-6">
          <div className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-3 border-b pb-1">
            Site Photographic Evidence:
          </div>
          <div className="grid grid-cols-2 gap-4">
            {observation.photos.map((photo, i) => (
              <div key={i} className="border border-gray-300 p-2 text-center rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.dataUrl}
                  alt={photo.caption || 'Site photo'}
                  className="max-h-48 mx-auto object-contain mb-2"
                />
                <div className="text-[10px] font-bold uppercase text-gray-600">
                  Stage: {photo.stage} {photo.caption ? `· ${photo.caption}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit History Log */}
      {observation.history && observation.history.length > 0 && (
        <div className="mb-8">
          <div className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2 border-b pb-1">
            Rectification Audit Trail &amp; Verification History:
          </div>
          <table className="w-full border-collapse border border-gray-300 text-[11px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-1.5 text-left border-r border-gray-300">Date &amp; Time</th>
                <th className="p-1.5 text-left border-r border-gray-300">Status</th>
                <th className="p-1.5 text-left border-r border-gray-300">Action By</th>
                <th className="p-1.5 text-left">Remarks &amp; Rectification Detail</th>
              </tr>
            </thead>
            <tbody>
              {observation.history.map((h, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="p-1.5 border-r border-gray-200 whitespace-nowrap">{formatDate(h.createdAt)}</td>
                  <td className="p-1.5 border-r border-gray-200 font-bold">{h.status}</td>
                  <td className="p-1.5 border-r border-gray-200">{h.byName}</td>
                  <td className="p-1.5">{h.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Formal Sign-off Section */}
      <div className="border-t-2 border-black pt-4 grid grid-cols-3 gap-6 text-xs mt-12">
        <div>
          <div className="text-gray-600 mb-8">Inspecting Officer:</div>
          <div className="border-t border-gray-400 pt-1 font-semibold">{observation.observedBy}</div>
          <div className="text-[10px] text-gray-500">Signature / Date</div>
        </div>

        <div>
          <div className="text-gray-600 mb-8">Maintenance Contractor / Lead:</div>
          <div className="border-t border-gray-400 pt-1 font-semibold">
            {observation.history && observation.history.length > 1 ? observation.history[1].byName : '______________________'}
          </div>
          <div className="text-[10px] text-gray-500">Signature / Date</div>
        </div>

        <div>
          <div className="text-gray-600 mb-8">QA/Safety Closure Verification:</div>
          <div className="border-t border-gray-400 pt-1 font-semibold">
            {observation.closedBy || '______________________'}
          </div>
          <div className="text-[10px] text-gray-500">Signature / Date</div>
        </div>
      </div>
    </div>
  );
}
