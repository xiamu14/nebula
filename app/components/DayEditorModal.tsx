"use client";

import { Suspense, lazy } from 'react';
import Modal from './ui/Modal';

const Editor = lazy(() => import('./editor/Editor'));

interface DayEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // ISO date string
}

export default function DayEditorModal({ isOpen, onClose, date }: DayEditorModalProps) {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const handleSave = async (markdown: string) => {
    // Save to API
    await fetch('/api/day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, markdown }),
    });

    // Trigger AI analysis
    await fetch('/api/analytic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, markdown }),
    });

    // Close modal after save
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formattedDate}>
      <div className="p-6">
        <Suspense fallback={<div className="p-4">Loading editor...</div>}>
          <Editor date={date} onSave={handleSave} />
        </Suspense>
      </div>
    </Modal>
  );
}
