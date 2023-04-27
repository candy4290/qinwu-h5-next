import { usePathname } from "next/navigation";
import BottomTabs from "./bottom-tabs";
import HomeLayout from "./home-layout";



export default function Layout(props: any) {
    const pathname = usePathname();
    const mainPage = pathname?.startsWith('/home/');
    if (!mainPage) {
        return <>
        <div className='h-screen'>
                {props.children}
            </div>
        </>
    }
    else {
        return <HomeLayout>
            <div className='h-[calc(100vh-56px)] overflow-y-auto bg-mitWhite'>
                {props.children}
            </div>
            <BottomTabs />
        </HomeLayout> 
    }
}