import { useUserInfo } from "@/utils/hooks/use-userInfo";

export default function HomeLayout(props: any) {
    useUserInfo();
    return (
        <>
        {props.children}
        </>
    )
}