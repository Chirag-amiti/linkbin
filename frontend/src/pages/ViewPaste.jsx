import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { getPasteBySlug } from '../api/pasteApi.js';

const ViewPaste = () => {
  const { slug } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
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
          <p className="eyebrow">{paste.language} · {paste.visibility}</p>
          <h1>{paste.title}</h1>
          <p className="muted">{paste.totalViews} views · created {new Date(paste.createdAt).toLocaleString()}</p>
        </div>
        <button className="button secondary" type="button" onClick={copyContent}>
          <Copy size={17} />
          Copy
        </button>
      </section>
      <div className="code-panel">
        <SyntaxHighlighter language={paste.language || 'text'} style={oneLight} showLineNumbers wrapLongLines>
          {paste.content}
        </SyntaxHighlighter>
      </div>
    </main>
  );
};

export default ViewPaste;
