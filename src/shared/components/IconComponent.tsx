import React from "react";
import { IconType } from "react-icons";

type IconComponentProps = {
    icon: IconType;
} & React.ComponentPropsWithoutRef<'svg'>;

export const IconComponent = ({ icon: Icon, ...props }: IconComponentProps) => {
    const IconElement = Icon as React.ElementType;
    return <IconElement {...props} />;
}; 