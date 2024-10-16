import React from 'react';
import CodeBlock from '@theme/CodeBlock'; // Docusaurus CodeBlock component

export default function YamlCodeBlock({ title = "config.yaml", children }) {
  return (
    <CodeBlock language="yaml" title={title} showLineNumbers>
      {children}
    </CodeBlock>
  );
}
