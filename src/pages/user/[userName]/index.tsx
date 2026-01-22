import type { GetServerSideProps } from "next";

import { Column } from "@/components/box/Flex";
import { SEO } from "@/components/seo/SEO";
import { Text } from "@/components/text/Text";
import type { SharedPageProps } from "@/utils/getSharedPageProps";
import getSharedPageProps from "@/utils/getSharedPageProps";

interface UserProfilePageProps extends SharedPageProps {
    userName: string;
}

export default function UserProfilePage({ userName }: UserProfilePageProps) {
    return (
        <>
            <SEO title={userName} />
            <Column style={{ "--gap": "24px" }}>
                <Text variant="h1">{userName}</Text>
            </Column>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async ({ params }) => {
    const userName = params?.userName as string;

    if (!userName) {
        return { notFound: true };
    }

    return {
        props: {
            ...getSharedPageProps(),
            userName,
        },
    };
};
