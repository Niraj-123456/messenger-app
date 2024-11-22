import { stringToColor } from "@/lib/stringHelper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

const CustomAvatar = ({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={src} />
      <AvatarFallback
        style={{
          backgroundColor: stringToColor(name) + "4D",
          color: stringToColor(name),
        }}
        className="font-medium"
      >
        {name?.substring(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;
