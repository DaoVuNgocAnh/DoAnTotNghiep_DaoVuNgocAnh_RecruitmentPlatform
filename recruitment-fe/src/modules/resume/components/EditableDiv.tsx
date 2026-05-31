import { useRef, useEffect } from 'react';

interface EditableDivProps {
  html: string;
  onChange: (html: string) => void;
  className?: string;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export const EditableDiv = ({ 
  html, 
  onChange, 
  className, 
  placeholder, 
  onKeyDown, 
  style 
}: EditableDivProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const lastHtml = useRef(html);

  useEffect(() => {
    if (ref.current && html !== ref.current.innerHTML) {
      ref.current.innerHTML = html;
      lastHtml.current = html;
    }
  }, [html]);

  const handleInput = () => {
    if (ref.current) {
      const currentHtml = ref.current.innerHTML;
      if (lastHtml.current !== currentHtml) {
        lastHtml.current = currentHtml;
        onChange(currentHtml);
      }
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleInput}
      onKeyDown={onKeyDown}
      className={className}
      style={style}
      data-placeholder={placeholder}
    />
  );
};
export default EditableDiv;
