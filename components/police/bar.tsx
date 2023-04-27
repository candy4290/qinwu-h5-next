import { ReactNode } from 'react';

/* tabbar标题 */
export function BarTitle(props: { title: string; hasSplit?: boolean }) {
  const { title, hasSplit = true } = props;
  return (
    <div className="flex items-center">
      <div>{title}</div>
      {hasSplit && <div className="relative right-[-18px] h-4 w-[1px] bg-mitGray opacity-20"></div>}
    </div>
  );
}

/* tabbar内容区域 */
export function BarContent(props: { children?: ReactNode }) {
  return <div className="hide-scrollbar h-[calc(100vh-230px)] px-5 pb-4 pt-[1px]">{props.children}</div>;
}
