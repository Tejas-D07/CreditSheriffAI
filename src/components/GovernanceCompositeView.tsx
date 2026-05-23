import React from 'react';
import { Scale, BookOpen } from 'lucide-react';
import GovernanceView from './GovernanceView';
import KnowledgeBaseView from './KnowledgeBaseView';
import { RAGItem } from '../types';

interface GovernanceCompositeViewProps {
  knowledgeDb: RAGItem[];
  onAddKnowledge: (title: string, content: string, section: string, tags: string[]) => Promise<void>;
  activeSubTab: 'policies' | 'knowledge';
  setActiveSubTab: (tab: 'policies' | 'knowledge') => void;
}

export default function GovernanceCompositeView({
  knowledgeDb,
  onAddKnowledge,
  activeSubTab,
  setActiveSubTab,
}: GovernanceCompositeViewProps) {
  return (
    <div className="space-y-6" id="governance-composite-container">
      {/* Prime Subnav Tabs bar */}
      <div className="flex border-b border-slate-100 pb-4 items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 uppercase font-heading">
            GOVERNANCE & COMPLIANCE
          </h2>
          <p className="text-slate-600 font-medium text-xs mt-1">
            Enforce custom model restrictions, check active cost policy violations, and manage semantic guideline indices.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex border border-slate-800 rounded-2xl overflow-hidden p-1 bg-slate-900 min-w-[320px]">
          <button
            onClick={() => setActiveSubTab('policies')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 ${
              activeSubTab === 'policies'
                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Shield Policies</span>
          </button>

          <button
            onClick={() => setActiveSubTab('knowledge')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 ${
              activeSubTab === 'knowledge'
                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>RAG Knowledge Base</span>
          </button>
        </div>
      </div>

      {/* Renders Selected Subview */}
      <div>
        {activeSubTab === 'policies' && (
          <GovernanceView />
        )}
        {activeSubTab === 'knowledge' && (
          <KnowledgeBaseView
            knowledgeDb={knowledgeDb}
            onAddKnowledge={onAddKnowledge}
          />
        )}
      </div>
    </div>
  );
}
