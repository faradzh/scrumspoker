import {z} from 'zod';

import { EstimationMethodEnum } from '../types';
import { Profile } from 'passport';
import { IntegrationTypeEnum } from '../useCases/constants';

export type EstimationMethod = z.infer<typeof EstimationMethodEnum>;
export interface User extends Profile {
    estimate?: number;
    picture?: string;
}
export interface Issue {
    id: string;
    key: string;
    // e.g. "Bug", "Task", "Story"
    issueType?: {
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
    status: string;
}

export interface JiraIssue {
    id: string;
    // e.g. "SCRUM-123"
    key: string;
    fields: {
        // e.g. "Bug", "Task", "Story"
        issueType?: {
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
        status: {
            name: string;
        };
    }
}

export interface JiraIssueResponse {
    issues: JiraIssue[];
}

interface AsanaIssue {
    id: string;
    // e.g. "SCRUM-123"
    key: string;
    props: {
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
        customfield_1: number;
        exempt: string;
        description: string;
    }
}

export type IssueResponse = {
    [IntegrationTypeEnum.JIRA]: JiraIssueResponse;
    [IntegrationTypeEnum.ASANA]: AsanaIssue;
}