import { z } from "zod";

import { EstimationMethodEnum } from "../types";
import { Profile } from "passport";
import { IntegrationTypeEnum } from "../useCases/constants";

export type EstimationMethod = z.infer<typeof EstimationMethodEnum>;
export interface User extends Profile {
  estimate?: number;
  picture?: string;
  online?: boolean;
  accessToken?: string;
}

export type Estimates = Record<string, Record<string, string>>;
export interface Issue {
  id: string;
  key: string;
  // e.g. "Bug", "Task", "Story"
  issueType?: {
    name: string;
    iconUrl: string;
  };
  // e.g. "Medium", "High", "Low"
  priority: string;
  // story points field, e.g. 1, 2, 3, 5, 8, 13
  customfield_10016: number;
  summary: string;
  description: {
    content: {
      content: {
        text: string;
      }[];
    }[];
  };
  status: string;
  assignee: string;
  reporter: string;
  issuetype: string;
  comment: any;
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
    };
    // e.g. "Medium", "High", "Low"
    priority: {
      name: string;
      iconUrl: string;
    };
    // story points custom field, e.g. 1, 2, 3, 5, 8, 13
    customfield_10016: number;
    summary: string;
    description: {
      content: {
        content: {
          text: string;
        }[];
      }[];
    };
    status: {
      name: string;
    };
    assignee: string;
    reporter: {
      displayName: string;
    };
    issuetype: {
      name: string;
    };
    comment: {
      comments: any[];
    };
  };
}

export interface JiraIssueResponse {
  issues: JiraIssue[];
  code?: number;
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
    };
    // e.g. "Medium", "High", "Low"
    priority: {
      name: string;
      iconUrl: string;
    };
    // story points custom field, e.g. 1, 2, 3, 5, 8, 13
    customfield_1: number;
    exempt: string;
    description: string;
  };
}

export type IssueResponse = {
  [IntegrationTypeEnum.JIRA]: JiraIssueResponse;
  [IntegrationTypeEnum.ASANA]: AsanaIssue;
};
