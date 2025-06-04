// ADF to Svelte component renderer
// Supports: paragraph, text, bulletList, listItem, rule, heading (level 1-6), strong, em

export function renderAdfToSvelte(adf) {
  if (!adf || adf.type !== "doc" || !Array.isArray(adf.content)) {
    return "<div><em>Invalid content</em></div>";
  }

  return adf.content.map(renderNode).join("");
}

function renderNode(node: any): string {
  if (!node) return "";

  switch (node.type) {
    case "paragraph":
      return `<p class="py-2">${renderContent(node.content)}</p>`;
    case "bulletList":
      return `<ul>${renderContent(node.content)}</ul>`;
    case "listItem":
      return `<li>${renderContent(node.content)}</li>`;
    case "rule":
      return `<hr class="py-2"/>`;
    case "heading":
      const level = Math.min(Math.max(node.attrs?.level || 1, 1), 6);
      return `<h${level} class="text-lg">${renderContent(
        node.content
      )}</h${level}>`;
    case "text":
      return renderTextNode(node);
    default:
      return "";
  }
}

export function renderContent(content = []) {
  return content.map(renderNode).join("");
}

function renderTextNode(node: any): string {
  let text = escapeHtml(node.text || "");

  if (node.marks) {
    node.marks.forEach((mark: any) => {
      switch (mark.type) {
        case "strong":
          text = `<strong>${text}</strong>`;
          break;
        case "em":
          text = `<em>${text}</em>`;
          break;
        case "underline":
          text = `<u>${text}</u>`;
          break;
        case "code":
          text = `<code>${text}</code>`;
          break;
        case "link":
          const href = escapeHtml(mark.attrs?.href || "#");
          text = `<a href="${href}" class="underline text-[blue]" target="_blank" rel="noopener noreferrer">${text}</a>`;
          break;
      }
    });
  }

  return text;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
