import React from "react";
import markdownit from "markdown-it";
import DOMPurify from "dompurify";

type Props = {
  text: string;
};

const md = markdownit({
  html: true,
  linkify: true,
});

// Configure markdown-it to add target="_blank" to all links
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  // Get the default rendered link
  const defaultLink = self.renderToken(tokens, idx, options);

  // Add target="_blank" and rel="noopener noreferrer" (for security)
  return defaultLink.replace(
    ">",
    ' target="_blank" rel="noopener noreferrer">'
  );
};

const Markdown = ({ text }: Props) => {
  const htmlcontent = md.render(text);

  // Configure DOMPurify to allow target="_blank"
  const sanitized = DOMPurify.sanitize(htmlcontent, {
    ADD_ATTR: ["target", "rel"],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitized }}></div>;
};

export default Markdown;
