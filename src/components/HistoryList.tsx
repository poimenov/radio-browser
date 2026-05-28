import React, { useState, useEffect, useCallback } from "react";
import {
    makeStyles,
    tokens,
    DataGrid,
    TableColumnDefinition,
    createTableColumn,
    DataGridBody,
    DataGridRow,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    TableCellLayout,
    Tooltip,
    Spinner,
    Link,
} from "@fluentui/react-components";
import { Clock12Regular, Location12Regular, VideoRegular } from "@fluentui/react-icons";
import { useServices } from "../contexts/ServicesContext";
import { HistoryRecord } from "../types/services.types";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        paddingTop: 0,
        paddingBottom: tokens.spacingVerticalS,
        paddingLeft: tokens.spacingHorizontalL,
        paddingRight: tokens.spacingHorizontalL,
    },
    tableWrapper: {
        flex: 1,
        overflow: "auto",
        borderRadius: tokens.borderRadiusLarge,
        backgroundColor: tokens.colorNeutralBackground1,
        boxShadow: tokens.shadow4,
        width: "100%",
        "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: tokens.colorNeutralBackground2,
            borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: tokens.colorNeutralStroke1,
            borderRadius: "4px",
            "&:hover": {
                backgroundColor: tokens.colorNeutralStroke2,
            },
        },
    },
    table: {
        width: "100%",
        minWidth: "100%",
        "& .fui-DataGrid__table": {
            width: "100%",
        },
    },
    timeCell: {
        fontFamily: tokens.fontFamilyMonospace,
        fontSize: tokens.fontSizeBase200,
        fontWeight: tokens.fontWeightRegular,
        whiteSpace: "nowrap",
    },
    stationCell: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground2,
    },
    titleLink: {
        fontSize: tokens.fontSizeBase200,
        fontWeight: tokens.fontWeightMedium,
        color: tokens.colorBrandForeground2,
        textDecoration: "none",
        "&:hover": {
            color: tokens.colorBrandForeground2Hover,
            textDecoration: "underline",
            cursor: "pointer",
        },
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: tokens.spacingVerticalXXL,
        gap: tokens.spacingVerticalL,
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow4,
    },
    emptyIcon: {
        fontSize: "48px",
        color: tokens.colorNeutralForeground3,
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: tokens.spacingVerticalXXL,
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow4,
    },
    rowHover: {
        "&:hover": {
            backgroundColor: tokens.colorNeutralBackground1Hover,
            cursor: "pointer",
        },
        transition: "background-color 0.2s ease",
    },
});

export const HistoryList: React.FC = () => {
    const styles = useStyles();
    const { historyDataAccess } = useServices();
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        const data = await historyDataAccess.getHistory();
        if (data.ok) {
            setHistory(data.value);
        } else {
            console.error("Failed to load history:", data.error);
        }
        setLoading(false);
    }, [historyDataAccess]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const formatCompactTime = (date: Date): string => {
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const searchOnYouTube = (title: string) => {
        const searchQuery = encodeURIComponent(title);
        window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
    };

    const columns: TableColumnDefinition<HistoryRecord>[] = [
        createTableColumn<HistoryRecord>({
            columnId: "startTime",
            renderHeaderCell: () => (
                <TableCellLayout media={<Clock12Regular />}>
                    Time
                </TableCellLayout>
            ),
            renderCell: (record) => (
                <Tooltip content={record.startTime.toLocaleString()} relationship="label">
                    <div className={styles.timeCell}>
                        {formatCompactTime(record.startTime)}
                    </div>
                </Tooltip>
            ),
        }),
        createTableColumn<HistoryRecord>({
            columnId: "stationName",
            renderHeaderCell: () => (
                <TableCellLayout media={<Location12Regular />}>
                    Station
                </TableCellLayout>
            ),
            renderCell: (record) => (
                <div className={styles.stationCell}>
                    {record.stationName}
                </div>
            ),
        }),
        createTableColumn<HistoryRecord>({
            columnId: "title",
            renderHeaderCell: () => (
                <TableCellLayout media={<VideoRegular />}>
                    Title
                </TableCellLayout>
            ),
            renderCell: (record) => (
                <Link
                    className={styles.titleLink}
                    onClick={() => searchOnYouTube(record.title)}
                    inline
                >
                    <Tooltip content="Search on YouTube" relationship="label">
                        <span>{record.title}</span>
                    </Tooltip>
                </Link>
            ),
        }),
    ];

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <Spinner label="Loading history..." size="large" />
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <Clock12Regular className={styles.emptyIcon} />
                    <div>No history records found.</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <DataGrid
                    items={history}
                    columns={columns}
                    getRowId={(record) => `${record.startTime.getTime()}-${record.stationName}`}
                    sortable
                    resizableColumns
                    className={styles.table}
                    style={{ width: "100%" }}
                >
                    <DataGridHeader>
                        <DataGridRow>
                            {({ renderHeaderCell }) => (
                                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                            )}
                        </DataGridRow>
                    </DataGridHeader>
                    <DataGridBody<HistoryRecord>>
                        {({ item, rowId }) => (
                            <DataGridRow<HistoryRecord>
                                key={rowId}
                                className={styles.rowHover}
                            >
                                {({ renderCell }) => (
                                    <DataGridCell>{renderCell(item)}</DataGridCell>
                                )}
                            </DataGridRow>
                        )}
                    </DataGridBody>
                </DataGrid>
            </div>
        </div>
    );
};