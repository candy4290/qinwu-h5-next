import { ReactNode } from "react";

/* tabbar标题 */
export function BarTitle(props: {title: string, hasSplit?: boolean}) {
    const {title, hasSplit = true} = props;
    return (
        <div className='flex items-center'>
            <div>{title}</div>
            {
                hasSplit && <div className='h-4 w-[1px] bg-[#707070] relative right-[-18px] opacity-20'></div>
            }
        </div>
    )
}

/* tabbar内容区域 */
export function BarContent(props: { children?: ReactNode }) {
    return (
        <div className='pt-[1px] px-5 pb-4 hide-scrollbar h-[calc(100vh-230px)]'>
            {
                props.children
            }
        </div>
    )
}