import React from 'react';

interface MarkdownParserProps {
  content: string;
  className?: string;
}

export const parseMarkdown = (text: string): (string | JSX.Element)[] => {
  const result: (string | JSX.Element)[] = [];
  let keyCounter = 0;

  // Simple approach: process text character by character
  let i = 0;
  let currentText = '';

  while (i < text.length) {
    // Check for **bold** text
    if (text.substr(i, 2) === '**') {
      // Add any accumulated text
      if (currentText) {
        result.push(currentText);
        currentText = '';
      }
      
      // Find the closing **
      const endIndex = text.indexOf('**', i + 2);
      if (endIndex !== -1) {
        const content = text.substring(i + 2, endIndex);
        result.push(
          <strong key={`bold-${keyCounter++}`} className="font-bold text-gray-900 dark:text-white">
            {content}
          </strong>
        );
        i = endIndex + 2;
        continue;
      }
    }
    
    // Check for __bold__ text
    if (text.substr(i, 2) === '__') {
      // Add any accumulated text
      if (currentText) {
        result.push(currentText);
        currentText = '';
      }
      
      // Find the closing __
      const endIndex = text.indexOf('__', i + 2);
      if (endIndex !== -1) {
        const content = text.substring(i + 2, endIndex);
        result.push(
          <strong key={`bold-${keyCounter++}`} className="font-bold text-gray-900 dark:text-white">
            {content}
          </strong>
        );
        i = endIndex + 2;
        continue;
      }
    }
    
    // Check for *italic* text (but not **)
    if (text[i] === '*' && text[i + 1] !== '*') {
      // Add any accumulated text
      if (currentText) {
        result.push(currentText);
        currentText = '';
      }
      
      // Find the closing *
      const endIndex = text.indexOf('*', i + 1);
      if (endIndex !== -1 && text[endIndex + 1] !== '*') {
        const content = text.substring(i + 1, endIndex);
        result.push(
          <em key={`italic-${keyCounter++}`} className="italic text-gray-800 dark:text-gray-200">
            {content}
          </em>
        );
        i = endIndex + 1;
        continue;
      }
    }
    
    // Check for `code` text
    if (text[i] === '`') {
      // Add any accumulated text
      if (currentText) {
        result.push(currentText);
        currentText = '';
      }
      
      // Find the closing `
      const endIndex = text.indexOf('`', i + 1);
      if (endIndex !== -1) {
        const content = text.substring(i + 1, endIndex);
        result.push(
          <code key={`code-${keyCounter++}`} className="bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm font-mono">
            {content}
          </code>
        );
        i = endIndex + 1;
        continue;
      }
    }
    
    // Regular character
    currentText += text[i];
    i++;
  }
  
  // Add any remaining text
  if (currentText) {
    result.push(currentText);
  }

  return result.length > 0 ? result : [text];
};

export const MarkdownText: React.FC<MarkdownParserProps> = ({ content, className = "" }) => {
  const parsedContent = parseMarkdown(content);
  
  return (
    <span className={className}>
      {parsedContent}
    </span>
  );
};

export default MarkdownText;
