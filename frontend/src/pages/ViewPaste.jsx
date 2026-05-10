import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import markdown from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import powershell from 'react-syntax-highlighter/dist/esm/languages/hljs/powershell';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { getPasteBySlug } from '../api/pasteApi.js';
import { getLanguageLabel, normalizeSyntaxLanguage } from '../utils/language.js';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', xml);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('jsx', javascript);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('powershell', powershell);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('yaml', yaml);

const ViewPaste = () => {
  const { slug } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState('');
  const loadedSlugRef = useRef(null);

  useEffect(() => {
    if (loadedSlugRef.current === slug) return;
    loadedSlugRef.current = slug;

    const loadPaste = async () => {
      try {
        const data = await getPasteBySlug(slug);
        setPaste(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadPaste();
  }, [slug]);

  const copyContent = () => {
    if (paste?.content) navigator.clipboard.writeText(paste.content);
  };

  if (error) {
    return (
      <main className="page narrow">
        <section className="panel">
          <h1>{error.includes('expired') ? 'Paste expired' : 'Paste unavailable'}</h1>
          <p className="muted">{error}</p>
        </section>
      </main>
    );
  }

  if (!paste) return <main className="page"><p>Loading paste...</p></main>;

  return (
    <main className="page">
      <section className="paste-view-header">
        <div>
          <p className="eyebrow">{getLanguageLabel(paste.language)} · {paste.visibility}</p>
          <h1>{paste.title}</h1>
          <p className="muted">{paste.totalViews} views · created {new Date(paste.createdAt).toLocaleString()}</p>
        </div>
        <button className="button secondary" type="button" onClick={copyContent}>
          <Copy size={17} />
          Copy
        </button>
      </section>
      <div className="code-panel">
        <SyntaxHighlighter
          language={normalizeSyntaxLanguage(paste.language)}
          style={atomOneLight}
          showLineNumbers
          wrapLongLines
          customStyle={{
            background: '#ffffff',
            fontSize: '15px',
            lineHeight: 1.6,
            padding: '20px',
          }}
        >
          {paste.content}
        </SyntaxHighlighter>
      </div>
    </main>
  );
};

export default ViewPaste;
