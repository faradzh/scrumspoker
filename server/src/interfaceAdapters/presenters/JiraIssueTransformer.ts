import { Issue, JiraIssue, JiraIssueResponse } from "../../entities/types";

class JiraIssueTransformer {
    public transform(data: JiraIssueResponse): Issue[] {
        const issues = data.issues;
        return issues.map((issue) => this.transformIssue(issue));
    }

    private transformIssue(issue: JiraIssue): Issue {
        return {
            id: issue.id,
            key: issue.key,
            status: issue.fields.status.name,
            priority: {
                name: issue.fields.priority.name,
                iconUrl: issue.fields.priority.iconUrl
            },
            storyPoints: issue.fields.customfield_10016,
            summary: issue.fields.summary,
            description: issue.fields.description?.content[0].content[0].text ?? null,
        };
    }
}

export default JiraIssueTransformer;