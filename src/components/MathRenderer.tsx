import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
  className?: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = '', block = false }) => {
  const renderedHtml = useMemo(() => {
    if (!text) return '';

    // If block is explicitly true and no $ signs exist, render the whole string as display math
    if (block && !text.includes('$')) {
      try {
        return katex.renderToString(text, {
          displayMode: true,
          throwOnError: false,
        });
      } catch (err) {
        console.error('KaTeX block render error:', err);
        return text;
      }
    }

    // Split text by display math ($$...$$) first, then inline math ($...$)
    // Regex matches $$...$$ or $...$
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g;
    const parts = text.split(mathRegex);

    return parts
      .map((part) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const formula = part.slice(2, -2).trim();
          try {
            return katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
            });
          } catch (e) {
            return `<span class="text-red-500">${part}</span>`;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1).trim();
          try {
            return katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
            });
          } catch (e) {
            return `<span class="text-red-500">${part}</span>`;
          }
        } else {
          // Escape standard HTML characters for plain text safety
          return part
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br/>');
        }
      })
      .join('');
  }, [text, block]);

  return (
    <span
      className={`katex-wrapper inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default MathRenderer;
