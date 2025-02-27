import { IssueInterface } from "./Issue";

class JiraIssue implements IssueInterface {
    public constructor(
        public id: string,
        public key: string,
        public issueType: { name: string; iconUrl: string },
        public priority: { name: string; iconUrl: string },
        public storyPoints: number,
        public summary: string,
        public description: string
    ) {
        this.id = id;
        this.key = key;
        this.issueType = issueType;
        this.priority = priority;
        this.storyPoints = storyPoints;
        this.summary = summary;
        this.description = description;
    }
}

export default JiraIssue;