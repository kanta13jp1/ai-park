import { Fragment } from "react";

export interface InlineCodeTextProps {
  text: string;
  codeClassName?: string;
}

/**
 * バッククォート囲み（`...`）を `<code>` 要素として安全にレンダリングするヘルパーコンポーネント。
 * HTML 文字列注入や dangerouslySetInnerHTML は使わず、React JSX 要素へ分割描画する。
 */
export function InlineCodeText({ text, codeClassName }: InlineCodeTextProps) {
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) {
          return null;
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 3) {
          return (
            <code
              key={index}
              className={
                codeClassName ??
                "font-mono text-[0.9em] bg-slate-100 text-indigo-700 px-1 py-0.5 rounded break-words"
              }
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

export default InlineCodeText;
