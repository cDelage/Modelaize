import { Method } from "../../../electron/types/Services.type";
import { IoAlbumsOutline, IoArrowUp, IoBrush, IoEnterOutline, IoExitOutline, IoTrash } from "react-icons/io5";
import { ICON_SIZE_SMALL } from "../../ui/UiConstants";

function MethodIcon({ method }: { method: Method }) {
    if (method === "GET") return <IoArrowUp size={ICON_SIZE_SMALL} />;
    if (method === "POST") return <IoExitOutline size={ICON_SIZE_SMALL} />;
    if (method === "PATCH") return <IoBrush size={ICON_SIZE_SMALL} />;
    if (method === "PUT") return <IoEnterOutline size={ICON_SIZE_SMALL} />;
    if (method === "DELETE") return <IoTrash size={ICON_SIZE_SMALL} />;
    if (method === "HEAD") return <IoAlbumsOutline size={ICON_SIZE_SMALL} />;

    return null;
}

export default MethodIcon;
