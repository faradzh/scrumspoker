export interface TIssue {
    id: string;
    key: string;
    // e.g. "Bug", "Task", "Story"
    issueType: {
        name: string;
        iconUrl: string;
    },
    // e.g. "Medium", "High", "Low"
    priority: {
        name: string;
        iconUrl: string;
    },
    // story points field, e.g. 1, 2, 3, 5, 8, 13
    storyPoints: number;
    summary: string;
    description: string;
}

interface IJiraIssue {
    id: string;
    // e.g. "SCRUM-123"
    key: string;
    fields: {
        // e.g. "Bug", "Task", "Story"
        issueType: {
            name: string;
            iconUrl: string;
        },
        // e.g. "Medium", "High", "Low"
        priority: {
            name: string;
            iconUrl: string;
        },
        // story points custom field, e.g. 1, 2, 3, 5, 8, 13
        customfield_10016: number;
        summary: string;
        description: string;
    }
}