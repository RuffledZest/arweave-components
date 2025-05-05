'use client';

import React, { useEffect } from 'react';
import { CodeCell } from '@betteridea/codecell';

interface CodeCellOptions {
  cellId: string;
  appName: string;
  code: string;
  width: string;
  height: string;
  devMode: boolean;
  onAOProcess?: (pid: string) => void;
  onNewMessage?: (messages: any[]) => void;
  onInbox?: (inbox: any[]) => void;
}

export default function LuaIDEPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cellId = params.get('cellId');
    const code = params.get('code');

    if (cellId && code) {
      const options: CodeCellOptions = {
        cellId,
        appName: 'wallet-builder',
        code,
        width: '100%',
        height: '100%',
        devMode: process.env.NODE_ENV === 'development',
        onAOProcess: (pid) => {
          window.parent.postMessage({ type: 'processId', pid }, '*');
        },
        onNewMessage: (messages) => {
          window.parent.postMessage({ type: 'newMessage', messages }, '*');
        },
        onInbox: (inbox) => {
          window.parent.postMessage({ type: 'inbox', inbox }, '*');
        }
      };

      const codeCell = new CodeCell(options);

      const container = document.getElementById('lua-ide-container');
      if (container) {
        container.appendChild(codeCell.element);
      }

      return () => {
        if (container) {
          container.innerHTML = '';
        }
      };
    }
  }, []);

  return (
    <div id="lua-ide-container" className="w-full h-full" />
  );
} 