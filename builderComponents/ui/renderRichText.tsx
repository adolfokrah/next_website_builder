import React from 'react';
import sanitizeHtml from 'sanitize-html';

interface Props {
  htmlContent: string;
}

const RenderRichText: React.FC<Props> = ({ htmlContent }) => {
  const sanitizedHtml = sanitizeHtml(htmlContent, {
    allowedAttributes: {
      '*': ['style', 'src', 'href', 'target'],
    },
    allowedTags: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'ul',
      'ol',
      'li',
      'img',
      'br',
      'hr',
      'link',
      'blockquote',
      'img',
      'p',
      'span',
      'mark',
      's',
      'u',
      'code',
      'pre',
    ],
  });

  return <div className="rich-text" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default RenderRichText;
