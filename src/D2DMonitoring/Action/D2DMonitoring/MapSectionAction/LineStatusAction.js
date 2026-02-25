import dayjs from "dayjs";
import { getWardLineStatus } from "../../../Services/MapSectionService/MapSectionService"

export const wardLineStatus = (ward, isMounted, setLineStatusByLine) => {
    try {
        const year = dayjs().format('YYYY');
        const month = dayjs().format('MMMM');
        const date = dayjs().format('YYYY-MM-DD');

        return getWardLineStatus(ward, year, month, date).then((resp) => {
            if (resp?.status === "success") {
                if (!isMounted) return;
                setLineStatusByLine(resp?.data || {});
            } else {
                setLineStatusByLine({});
            }
        });
    } catch (error) {
        return Promise.resolve({ statusByLine: {}, statusList: [] });
    }
}

const normalizeLineStatus = (status = "") => String(status).trim().toLowerCase();
export const getLineColorByStatus = (status, DEFAULT_LINE_STYLE) => {
    const normalizedStatus = normalizeLineStatus(status);
    if (normalizedStatus === "linecompleted") return "#22c55e";
    if (normalizedStatus === "skipped") return "#ef4444";
    return DEFAULT_LINE_STYLE.strokeColor;
};